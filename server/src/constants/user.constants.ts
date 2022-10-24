interface UserPayload {


        username: string
        email: string
        password: String
        isAdmin: Boolean
        isVerified: Boolean
        tokens: { accessToken: string, refreshToken: string }[]

        // methods
        generateAuthToken: any | Function,
        generateVerificationToken: any | Function,
        login: any | Function,
        verify: any | Function,
        refreshAuthToken: any | Function,

        [key: string]: any
}