export default {
    blogName: 'SorcererXW Blog',
    blogFavicon: '/static/favicon.png',
    siteManifest: '/static/manifest.json',
    blogTablePageId: 'd6f20169e3b849059656e33a47e19003',
    blogTableViewId: getTableViewId(),
    googleAnalyticsId: 'UA-125409209-1',
    disqusConfig: {
        enable: true,
        shortName: 'sorcererxwblog',
    },
}

function getTableViewId() {
    const dev = process.env.NODE_ENV !== 'production'
    if (dev) {
        return 'f5606624c1bf468ea87228889f9df9cb'
    }
    return 'e38cce53950143c28d3449b99397cbca'
}
