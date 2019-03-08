import { configure } from 'enzyme'
import ReactSixteenAdapter from 'enzyme-adapter-react-16'
// Import global Response
import 'isomorphic-fetch'
import * as log from 'loglevel'

log.disableAll()

configure({ adapter: new ReactSixteenAdapter() })
