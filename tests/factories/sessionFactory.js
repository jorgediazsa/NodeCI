//library used to make buffer
const Buffer = require('safe-buffer').Buffer
//library used to sign session strings
const Keygrip = require('keygrip')
const keys = require('../../config/keys')
//creating keygrip object
const keygrip = new Keygrip([keys.cookieKey])

module.exports = (user) => {
    //session object used to store userId
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    }

    //encrypting session object
    const session = Buffer.from(
        JSON.stringify(sessionObject)
    ).toString('base64')

    //creating signature for session string
    const sig = keygrip.sign('session=' + session)

    return {
        session,
        sig
    }
}