import './style'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from './page/homePage'
import PostPage from './page/postPage'
import BlogPage from './page/blogPage'
import ErrorPage from './page/errorPage'

const App = () => (
  <Switch>
    <Route exact={true} path='/' component={HomePage}/>
    <Route path={'/blog'} component={BlogPage}/>
    <Route path={'/post'} component={PostPage}/>
    <Route component={ErrorPage}/>
  </Switch>
)

export default App
