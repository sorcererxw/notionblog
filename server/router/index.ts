import Router from 'koa-router'
import api from './api'
import fe from './fe'
import seo from './seo'

const router = new Router()

router.use('/api', api.routes(), api.allowedMethods())
router.use('', seo.routes(), seo.allowedMethods())
router.use('', fe.routes(), fe.allowedMethods())
router.get('/test', ctx => {
    ctx.response.body = 'ok'
})

export default router
