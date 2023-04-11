const {retrieveAllReimbursements, retrieveAllReimbursementsByUsername,} = require('../dao');


jest.mock('./dao.js', function () {
    return {
        retrieveAllReimbursements: jest.fn(),
        retrieveAllReimbursementsByUsername: jest.fn(),
    }
});

describe ('Retreive Reimbursements tests', () => {

    test ('All Reimbursements must be shown', async() => {
        await expect(retrieveAllReimbursements()
).rejects.toThrow(ViewReimbursementError);

    });

    test ('Only reimbursements by Username should be shown', async() => {
        await expect(service.addReimbursement( "Victor", {"amount": 100, "description": "Food", "image": "data:image/webp;base64,UklGRuQaAABXRUJQVlA4WAoAAAASAAAA2wEAFwEAQU5JTQYAAAD"})
).rejects.toThrow(ViewReimbursementError);

    });
})

describe ('Authorization tests', () => {
    test ('Token not provided', async() => {
        await expect(service.authorizeEmployee("")
).rejects.toThrow(JsonWebTokenError);

    });

//     test ('Employee role required', async() => {
//         await expect(service.authorizeEmployee("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmFnZXIxIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjc2NzQwMTk3LCJleHAiOjE2Nzc2MDQxOTd9.iqn2YJm_CMzJugiHdg2mFLUlY2DaplmLLAR0ULSf7Qg")
// ).rejects.toThrow(AuthorizationError);

//     });

    
});