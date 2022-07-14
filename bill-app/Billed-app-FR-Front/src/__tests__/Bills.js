 import {screen, waitFor, fireEvent} from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import Bills from "../containers/Bills"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import router from "../app/Router.js";
 import store from "../__mocks__/store";

  describe("Given I am connected as an employee", () => {
   describe("When I am on Bills Page", () => {
     test("Then bill icon in vertical layout should be highlighted", async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)

       await waitFor(() => screen.getByTestId('icon-window'))
       const windowIcon = screen.getByTestId('icon-window')
       console.log(Array.from(windowIcon.classList))

       expect(Array.from(windowIcon.classList).includes('active-icon')).toBe(true)
     })

     describe("If I have existing bills", () => {
      test("bills should be displayed in the dashboard", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
    
        const bills = new Bills({
          document,
          onNavigate,
          store: store,
          localStorage: window.localStorage,
        })
    
        const fetchedBills = await bills.getBills()
        const billsList = await store.bills().list()
    
        document.body.innerHTML = BillsUI({ data: fetchedBills })
    
        expect(fetchedBills.length).toBe(4)
      })
      test("Then bills should be ordered from earliest to latest", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        const antiChrono = (a, b) => ((a < b) ? 1 : -1)
        const datesSorted = [...dates].sort(antiChrono)
        expect(dates).toEqual(datesSorted)
      })
    })
  describe("When I click on the 'New Bill' button", () => {
    test("It should display the 'New Bill' page", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const billsList = new Bills({
        document,
        onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
        store: null,
        localStorage: window.localStorage
      })

      const handleClickNewBill = jest.fn(billsList.handleClickNewBill)

      const buttonNewBill = screen.getByTestId('btn-new-bill')

      expect(buttonNewBill).toBeTruthy()

      buttonNewBill.addEventListener('click', handleClickNewBill)
      fireEvent.click(buttonNewBill)
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy() 
     })
  })

  describe("When I click on an eye icon", () => {
    test("A modal should open", () => {
      let billsList

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })

      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))

      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      $.fn.modal = jest.fn()

      billsList = new Bills({
        document,
        onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
        store: null,
        localStorage: window.localStorage
      })

      const eye = screen.getAllByTestId('icon-eye')[0]

      const handleClickIconEye = jest.fn(billsList.handleClickIconEye(eye))
  
      eye.addEventListener('click', handleClickIconEye)
      fireEvent.click(eye)
      
      expect(handleClickIconEye).toHaveBeenCalled()
     })
  })
 })
})

// Integration test : GET

describe("When I navigate to Bills Page", () => {

  test("I get bills from the API GET method", async () => {
    const getSpy = jest.spyOn(store, "bills")
    const userBills = await store.bills().list()
    console.log(userBills)
    expect(getSpy).toHaveBeenCalledTimes(1)
    expect(userBills.length).toBe(4)
  })

  test("API fetch fails with 404 error", async () => {
    store.bills.mockImplementationOnce(() => {
      return {
        list: () => {
          return Promise.reject(new Error("Erreur 404"))
        }
      }
    })
    const html = BillsUI({error: "Erreur 404"})
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })
  
  test("API fetch fails with 500 error", async () => {
    store.bills.mockImplementationOnce(() => {
      return {
        list: () => {
          return Promise.reject(new Error("Erreur 500"))
        }
      }
    })
    const html = BillsUI({error: "Erreur 500"})
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 500/)
    expect(message).toBeTruthy()
  })
})