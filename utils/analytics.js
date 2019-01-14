import ReactGA from 'react-ga'

const config = require("../config")
const googleAnalyticsId = config.googleAnalyticsId

export const initGA = () => {
    console.log('GA init')
    ReactGA.initialize(googleAnalyticsId)
}

export const logPageView = () => {
    console.log(`Logging pageview for ${window.location.pathname}`)
    ReactGA.set({page: window.location.pathname})
    ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category = '', action = '') => {
    if (category && action) {
        ReactGA.event({category, action})
    }
}

export const logException = (description = '', fatal = false) => {
    if (description) {
        ReactGA.exception({description, fatal})
    }
}