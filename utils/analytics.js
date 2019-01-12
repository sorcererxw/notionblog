import ReactGA from 'react-ga'
import {google_analytics_id} from "../blog.config"

export const initGA = () => {
    console.log('GA init')
    ReactGA.initialize(google_analytics_id, {debug: true})
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