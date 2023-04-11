const {retrieveUserByUsername, retrieveUserByEmail, validateEmail} = require('../app/signin')
const signinError = require('./signin-errors');




//signin tests
jest.mock('../app/signin',function(){
    return{
        retrieveUserByUsername: jest.fn(),
        retrieveUserByEmail: jest.fn(),
        validateEmail: jest.fn(),
        signin: jest.fn(),
    }
})

jest.mock('../app/controllers/user.controller', function(){
    return{
        validateEmail: jest.fn()
    }
})

describe('testing signin function', () =>{
    test("signin should throw error if user object does not exist", async ()=> {
        retrieveUserByUsername.mockReturnValueOnce(Promise.resolve({undefined}))
        
      
       await expect(signin("username", "password")).rejects.toThrow(signinError)
    })

    test("signin should throw error if bcrypt function returns false", async ()=> {
        retrieveUserByUsername.mockReturnValueOnce(Promise.resolve({Item:{username: "username", password: "password", role: "employee"}}))
        
       await expect(signin("username", "password")).rejects.toThrow(signinError)
    })

    test("successful signin should return token", async () => {
        retrieveUserByUsername.mockReturnValueOnce(Promise.resolve({Item:{username: "username", password: "$2a$05$Mjs/9Lfif0XRQfdVTVnux.nktvJ036s.QwBYa8eV2DH5G0kkIlTyi", role: "employee"}}))
        
        await signin("username", "password")
        
        
        expect(createToken).toHaveBeenCalledWith("username", "employee")
    })

})


