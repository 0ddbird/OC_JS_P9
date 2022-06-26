# Login.js

```js
describe("Given that I am a user on login page") l39-l56

/*----------------------------------------EMPLOYEE--------------------------------------------*/
OK  describe("When I do not fill fields and I click on employee button Login In") 
    test("Then It should renders Login page")

OK  describe("When I do fill fields in incorrect format and I click on employee button Login In")
    test("Then It should renders Login page")


OK  describe("When I do fill fields in correct format and I click on employee button Login In")
    test("Then I should be identified as an Employee in app")
    test("It should renders Bills page")

TO DO  describe("When I do fill fields in correct format but my credentials don't exist yet")
  test("Then it should call the createUser method")
  test("It should renders Bills page")

/*-----------------------------------------ADMIN---------------------------------------------*/
describe("Given that I am a user on login page") l64-l83

OK describe("When I do not fill fields and I click on admin button Login In") 
    test("Then It should renders Login page") 

OK  describe("When I do fill fields in incorrect format and I click on admin button Login In")
    test("Then it should renders Login page")

OK  describe("When I do fill fields in correct format and I click on admin button Login In")
    test("Then I should be identified as an HR admin in app")
    test("It should renders HR dashboard page")

TO DO  describe("When I do fill fields in correct format but my credentials don't exist yet")
    test("Then it should call the createUser method")
    test("It should renders Bills page")
```

## Bills.js

```js
OK                      describe("Given I am connected as an employee")
OK                          describe("When I am on Bills Page")
UPDATED / NOT WORKING           test("Then bill icon in vertical layout should be highlighted")
OK                              test("Then bills should be ordered from earliest to latest")
NEW                             test("handleClickNewBill should be called when I click the New Bill button")
NEW                             test("handleClickIconEye should be called when I click the Eye icon")
TO DO                           test("I should see bills if I have any in my account")
```

## NewBill.js

```js
TODO    describe("Given I am connected as an employee")
TODO        test("handleChangeFile should be called when I want to upload a proof") l18 - l26
TODO        test("My uploaded file should be in a specific format") l60-l65
TODO        test("a new Bill should be created in the store when ") l28 - l42
TODO        test("handleSubmit should be called when I want to submit my bill") l43 - l59
```