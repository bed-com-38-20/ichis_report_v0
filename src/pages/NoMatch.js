import React from 'react'
import { Navigate } from 'react-router-dom'
import { TABLES } from '../modules/paths'

export const NoMatch = () => <Navigate to={TABLES} />

export default NoMatch
