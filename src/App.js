import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import './locales'
import './styles/modalFix.css'

import globalStyles from './styles/global.style'
import classes from './App.module.css'
import { TABLES } from './modules/paths'
import { Tables, NoMatch } from './pages'
import { Navigation } from './navigation'

const MyApp = () => {
    return (
        <HashRouter>
            <div className={classes.container}>
                <main className={classes.right}>
                    <Switch>
                        <Route path={TABLES} component={Tables} />
                        <Route component={NoMatch} />
                    </Switch>
                </main>
            </div>
            <style jsx global>
                {globalStyles}
            </style>
        </HashRouter>
    )
}

export default MyApp
