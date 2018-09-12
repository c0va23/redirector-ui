import * as React from 'react'

import {
  Locales,
} from 'redirector-client'

export class AppContextData {
  errorLocales: Locales
}

export default React.createContext<AppContextData>({
  errorLocales: [],
})
