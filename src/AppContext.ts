import * as React from 'react'

import {
  Locales,
} from 'redirector-client'

class AppContext {
  errorLocales: Locales
}

export default React.createContext<AppContext>({
  errorLocales: [],
})
