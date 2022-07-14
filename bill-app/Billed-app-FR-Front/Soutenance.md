# Billed App

___

## <a id="index">Index</a>

#### 1 - [Debug](#1)

##### .........  1.1 - [Bug 1 : Tri des notes de frais](#11)

##### .........  1.2 - [Bug 2 : Login Admin](#12)

##### .........  1.3 - [Bug 3 : Format de fichier](#13)

##### .........  1.4 - [Bug 4 : Bug UI accordéon](#14)

##### .........  1.5 - [Bug 5 : Montant d'une new bill négatif](#15)

#### 2 - [Tests unitaires](#2)

##### .........  2.1 - [Bills](#21)

##### ......... 2.2 - [Login](#22)

##### .........  2.3 - [Logout](#23)

##### .........  2.4 - [NewBill](#24)

#### 3 - [Tests d'intégration](#3)

##### .........  3.1 - [Bills.js](#31)

##### .........  3.2 - [NewBill.js](#32)

#### 4 - [Plan de tests End to End](#4)

#### 5 - [Difficultés et axes d'amélioration](#5)

___

## <a id="1">1 - Debug</a>

### <a id="11">1.1 - Bug 1 : Tri chronologique des notes de frais</a>

**Bug:** Le test Bills / les notes de frais s'affichent par ordre décroissant est passé au rouge.
**Fix:** Trier les bills par ordre décroissant

***views/BillsUI.js***

```js
// line 21
const rows = (data) => {
  return (data && data.length) ? data
  .sort((billA, billB) => billA.date < billB.date ? 1 : -1)
  .map(bill => row(bill)).join("") : ""
}
// line 27
```

### <a id="12">1.2 - Bug 2 : Login Admin</a>

**Bug:** Dans le rapport de test "Login, si un administrateur remplit correctement les champs du Login, il devrait naviguer sur la page Dashboard", le test est passé au rouge (cf. copie d'écran).
**Fix:**

```js
handleSubmitAdmin = e => {
    e.preventDefault()
    const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="employee-password-input"]`).value,
      status: "connected"
    }
    // ...
}
```

changé en

```js
handleSubmitAdmin = e => {
    e.preventDefault()
    const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
      status: "connected"
    }
    // ...
}

```

### <a id="13">1.3 - Bug 3 : Format de fichier</a>

**Bug:** Dans le rapport de test "Login, si un administrateur remplit correctement les champs du Login, il devrait naviguer sur la page Dashboard", le test est passé au rouge

Si je me connecte à présent en tant qu'Admin, et que je clique sur le ticket correspondant, le nom du fichier affiché est null. De même, lorsque je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image. 

**Fix:** Contraindre l'utilisateur de type *Employé* à uploader une pièce jointe au format valide.

***containers/NewBill.js***

```js
// l17
handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileid = filePath[filePath.length-1]
    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    
    // Contrainte extension de fichier
    const extensionRegex = new RegExp('^.*\.(jpg|jpeg|gif|png|pdf)$', "i")
    if (!extensionRegex.test(file.id)) return false
    
    formData.append('file', file)
    formData.append('email', email)
    
    /*
      l28
      ...
    */
    }
```

### <a id="14">1.4 - Bug 4 : Bug UI accordéon</a>

**Bug:** Je suis connecté en tant qu'administrateur RH, je déplie une liste de tickets (par exemple : statut "validé"), je sélectionne un ticket, puis je déplie une seconde liste (par exemple : statut "refusé"), je ne peux plus sélectionner un ticket de la première liste.

**Fix:** Retirer l'event listener sur chaque *card* avant de le remettre.

***containers/Dashboard.js***

```js
  handleShowTickets(e, bills, index) {

    // ...

    bills.forEach(bill => {
      // Remove current event listener first
      $(`open-bill${bill.id}`).off();
      // Add back an event listener
      $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
    })

    return bills

  }
```

### <a id="15">1.5 - Bug 5 : Montant d'une New Bill négatif</a>
**Bug:** Je suis connecté en tant qu'employé, je peux créer une note de frais avec un montant négatif

**Fix:**
NewBillUI.js

```js
// Ajout d'un min="0" pour le champ montant
<input required type="number" min="0" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>

```


[:arrow_up_small: Retourner à l'index](#index)

## <a id="2">2 - Tests Unitaires</a>

### <a id="22">2.1 - Bills.js</a>

#### Test de la méthode *.bills().list()*

```js
describe("If I have existing bills", () => {
  test("bills should be displayed in the dashboard", async () => {
    const onNavigate = (pathid) => {
      document.body.innerHTML = ROUTES({ pathid })
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
})
```

#### Test de l'appel à la méthode *.handleClickNewBill()*

```js
describe("When I click on the 'New Bill' button", () => {
    test("It should display the 'New Bill' page", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const billsList = new Bills({
        document,
        onNavigate: (pathid) => document.body.innerHTML = ROUTES({ pathid }),
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
```

#### Test de l'appel à la méthode *.handleClickIconEye()*

```js
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
        onNavigate: (pathid) => document.body.innerHTML = ROUTES({ pathid }),
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
  ```

### <a id="22">2.2 - Login.js</a>

Tests existants OK : ceux qui ne passaient pas étaient dûs au bug 2.


### <a id="23">2.3 - NewBill.js</a>

Setup commun aux tests de NewBill
```js
describe("Given I am connected as an employee on New Bill Page", () => {
  let newBill
     beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
       const html = NewBillUI()
       document.body.innerHTML = html
       newBill = new NewBill({
        document,
        onNavigate: (pathid) => document.body.innerHTML = ROUTES({ pathid }),
        store: store,
        localStorage: window.localStorage
      })
     })
})
```

#### Test appel méthode *.handleChangeFile()*

```js
describe("Given I am connected as an employee on New Bill Page", () => {
  
     describe("When I select a file", () => {

      test("it should call handleChangeFile method", () => {
        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const inputFile = screen.getByTestId('file')
        inputFile.addEventListener('change', handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(['proof.jpg'], 'proof.jpg', {type: 'image/jpg'})]
          }
        })
        expect(handleChangeFile).toHaveBeenCalled()
      })
     })
   })
```

#### Test validation du format de fichier de la méthode *.handleChangeFile()* 

```js
describe("and the file format is valid", () => {
  test('it should update the input field', () => {
    const handleChangeFile = jest.fn(newBill.handleChangeFile)
    const inputFile = screen.getByTestId('file')
    inputFile.addEventListener('change', handleChangeFile)
    fireEvent.change(inputFile, {
      target: {
        files: [new File(['proof.jpg'], 'proof.jpg', {type: 'image/jpg'})]
      }
    })
    expect(inputFile.files[0].id).toBe("proof.jpg");
  })
})

```

#### Test retour méthode *.handleChangeFile()* avec fichier incorrect

```js
describe("and the file format is not valid", () => {
  test('it should not update the input field', () => {
    const handleChangeFile = jest.fn(newBill.handleChangeFile)
    const inputFile = screen.getByTestId('file')
    inputFile.addEventListener('change', handleChangeFile)
    fireEvent.change(inputFile, {
      target: {
        files: [new File(['proof.xyz'], 'proof.xyz', {type: 'text/xyz'})]
      }
    })
    expect(handleChangeFile).toHaveReturnedWith(false)
  })
})
```

#### Test appel méthode *.handleSubmit()*

```js
describe('When I submit the New Bill form', () => {

test('It should call handleSubmit method', () => {
  const handleSubmit = jest.fn(newBill.handleSubmit)
  const newBillForm = screen.getByTestId('form-new-bill')
  newBillForm.addEventListener('submit', handleSubmit)
  fireEvent.submit(newBillForm)
  expect(handleSubmit).toHaveBeenCalled()
})
})

```

[:arrow_up_small: Retourner à l'index](#index)

## <a id="3">3 - Tests d'intégration</a>

### <a id="31">3.1 - Bills.js</a>

```js
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
```

### <a id="32">3.2 - NewBill.js</a>

```js
// POST integration tests
describe("Given I am a user connected as Employee", () => {
  describe("When I create new bill", () => {
    test("send bill to mock API POST", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const root = document.createElement("div");
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      jest.spyOn(store, "bills")

      store.bills.mockImplementationOnce(() => {
        return {
          create: (bill) => {
            return Promise.resolve()
          },
        }
      })

      await new Promise(process.nextTick);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy()
    })
    describe("When an error occurs on API", () => {
      test("send bill to mock API POST", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill)
        jest.spyOn(store, "bills");

        store.bills.mockImplementationOnce(() => {
          return {
            create: (bill) => {
              return Promise.reject(new Error("Erreur 404"))
            },
          }
        })

        await new Promise(process.nextTick);
        const html = BillsUI({ error: "Erreur 404" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      });
      test("send bill to mock API POST", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
        const root = document.createElement("div")
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill)
        jest.spyOn(store, "bills")

        store.bills.mockImplementationOnce(() => {
          return {
            create: (bill) => {
              return Promise.reject(new Error("Erreur 500"))
            },
          }
        })

        await new Promise(process.nextTick);
        const html = BillsUI({ error: "Erreur 500" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})
```

[:arrow_up_small: Retourner à l'index](#index)

## <a id="">4 - Plan de test End to End</a>

**Scénario 1**

>**GIVEN** : Je suis un visiteur (non connecté)
>**WHEN** : Je ne remplis pas le champ e-mail ou le champ password du login employé et je clique sur le bouton "Se connecter"
>**THEN** : Je reste sur la page Login et je suis invité à remplir le champ manquant

**Scénario 2**
> **GIVEN** : Je suis un visiteur (non connecté)
**WHEN** : Je remplis le champ e-mail du login employé au mauvais format (sans la forme chaîne@chaîne) et je clique sur le bouton "Se connecter".
**THEN** : Je reste sur la page Login et je suis invité à remplir le champ e-mail au bon format.

**Scénario 3**
> **GIVEN** : Je suis un visiteur (non connecté).
**WHEN** : Je remplis le champ e-mail du login employé au bon format (sous la forme chaîne@chaîne), le champ password du login employé et je clique sur le bouton "Se connecter".
**THEN** : Je suis envoyé sur la page Dashboard.

**Scénario 4**
> **GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : J'ai des factures existantes
**THEN** : Je peux voir la liste de ces factures classées par ordre chronologique

**Scénario 5**
> **GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : Je n'ai pas de factures existantes
**THEN** : Mon dashboard contient uniquement le bouton "Nouvelle note de frais"

**Scénario 6**
>**GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : Je clique sur le bouton "Nouvelle note de frais"
**THEN** : Je suis envoyé vers la page "Envoyer une note de frais"

**Scénario 7**
>**GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : Je clique sur le bouton en forme d'oeil sur une ligne de note de frais
**THEN** : Le justificatif de la note de frais s'affiche dans une pop-up

**Scénario 8**
>**GIVEN** : Je suis connecté en tant qu'employé sur la page Dashboard
**WHEN** : Je clique sur le bouton 'I/O' dans le menu vertical
**THEN** : Je suis déconnecté et renvoyé à la page login

**Scénario 9**
>**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants : Type de dépense, Nom de la dépense, Date, Montant TTC, TVA, Commentaire, Justificatif et je clique sur Envoyer
**THEN** : Ma note de frais est soumise et je suis renvoyée au Dashboard. Ma nouvelle note de frais apparait dans la liste.

**Scénario 10**
>**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants sauf la date et je clique sur Envoyer
**THEN** : Je reste sur la page "Envoyer une note de frais" et suis invité à corriger ma saisie

**Scénario 11**
>**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants sauf le montant TTC et je clique sur Envoyer
**THEN** : Je reste sur la page "Envoyer une note de frais" et suis invité à corriger ma saisie

**Scénario 12**
>**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants sauf le taux de TVA et je clique sur Envoyer
**THEN** : Je reste sur la page "Envoyer une note de frais" et suis invité à corriger ma saisie

**Scénario 13**
>**GIVEN** : Je suis connecté en tant qu'employé sur la page "Envoyer une note de frais"
**WHEN** : Je remplis correctement les champs suivants sauf la pièce-jointe et je clique sur Envoyer
**THEN** : Je reste sur la page "Envoyer une note de frais" et suis invité à corriger ma saisie

[:arrow_up_small: Retourner à l'index](#index)

## <a id="5">5 - Difficultés rencontrées et axes d'amélioration</a>

### Difficultés rencontrées

- La complexité de la codebase : les composants sont des classes, retournent du HTML, il y a du jQuery.
- La logique de Jest et des mocks pour les tests unitaires

### Axes d'amélioration

- Le test des erreurs, par exemple dans Bills.js

```js
try {
  return {
    ...doc,
    date: formatDate(doc.date),
    status: formatStatus(doc.status)
  }
} catch(e) {
  // if for some reason, corrupted data was introduced, we manage here failing formatDate function
  // log the error and return unformatted date in that case
  console.log(e,'for',doc)
  return {
    ...doc,
    date: doc.date,
    status: formatStatus(doc.status)
  }
}

```

ou dans Login.js

```js
.catch(
  (err) => this.createUser(user)
)
```

[:arrow_up_small: Retourner à l'index](#index)