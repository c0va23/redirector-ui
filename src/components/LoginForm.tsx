import * as React from "react"

import Config from "../Config"

interface LoginFormProps {
  onSave: (config: Config) => void,
}

export default class LoginForm extends React.Component<LoginFormProps, Config> {
  constructor(props: any) {
    super(props)
    this.state = {
      basePath: "",
      username: "",
      password: "",
    }
  }

  render() {
    return <form onSubmit={this.onSubmit}>
      <input
        placeholder="Base path"
        name="basePath"
        value={this.state.basePath}
        onChange={this.onInputChange}
      />
      <br/>
      <input
        placeholder="Username"
        name="username"
        value={this.state.username}
        onChange={this.onInputChange}
      />
      <br/>
      <input
        placeholder="Password"
        name="password"
        value={this.state.password}
        onChange={this.onInputChange}
      />
      <br/>
      <button type="submit">
        Login
      </button>
    </form>
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const name = event.target.name
    const value = event.target.value
    this.setState({
      ...this.state,
      [name]: value,
    })
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.onSave(this.state)
  }
}
