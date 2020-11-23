import { fetchPasswords } from "./skydb";
import { Component } from "react";
import LoginPage from "./LoginPage";
import PasswordsPage from "./PasswordsPage";

class App extends Component {
  state = {
    seed: null,
    passwords: []
  };

  login = (seed) => {
      fetchPasswords('lol').then(items => {
          this.setState({ seed, passwords: items })
      });
  }

  render() {
    return (
        <div className="App">
          {
            this.state.seed === null ?
              <LoginPage login={(seed) => this.login(seed)} />
            :
              <PasswordsPage logout={() => this.setState({seed: null, passwords: []})} seed={this.state.seed} passwords={this.state.passwords} />
          }
        </div>
    );
  }
}

export default App;
