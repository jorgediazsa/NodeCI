const Page = require('./helpers/page')

let page

beforeEach(async () => {
    page = await Page.build()
    await page.goto('http://localhost:3000')
})

afterEach(async () => {
    await page.close()
})

describe('when logged in', async () => {
    beforeEach(async () => {
        await page.login()
        await page.click('a.btn-floating')
    })

    test('can see blog create form', async () => {
        const label = await page.getContentOf('form label')
    
        expect(label).toEqual('Blog Title')
    })

    describe('and using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title')
            await page.type('.content input', 'My Content')
            await page.click('form button')
        })

        test('submitting takes user to review screen', async () => {
            const text = await page.getContentOf('h5')

            expect(text).toEqual('Please confirm your entries')
        })

        test('submitting then saving adds blog to index page', async () => {
            await page.click('button.green')
            await page.waitFor('.card')

            const title = await page.getContentOf('.card-title')
            const content = await page.getContentOf('.card-content p')

            console.log(content)
            expect(title).toEqual('My Title')
            expect(content).toEqual('My Content')
        })
    })

    describe('and using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button')
        })
        test('the form shows an error message', async () => {
            const titleError = await page.getContentOf('.title .red-text')
            const contentError = await page.getContentOf('.content .red-text')

            expect(titleError).toEqual('You must provide a value')
            expect(contentError).toEqual('You must provide a value')
        })
    })
})

describe('user is not logged in', async () => {
    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'T',
                content: 'C'
            }
        },
    ]

    test('blog related actions are prohibited', async () => {
        const results = await page.execRequests(actions)
        for (let result of results) {
            expect(result).toEqual({ error: 'You must log in!' })
        }
    })
})