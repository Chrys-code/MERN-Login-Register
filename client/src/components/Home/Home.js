import React from "react";
import { getFromStorage, setInStorage } from "../../utils/storage";
import "whatwg-fetch";
import "./Home.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      token: "",
      signUpErr: "",
      signInErr: "",
      signInEmail: "",
      signInPassword: "",
      signUpEmail: "",
      signUpUname: "",
      signUpPassword: "",
    };
  }

  componentDidMount() {
    const obj = getFromStorage("login_app");
    if (obj && obj.token) {
      const { token } = obj;

      fetch("/api/account/verify?token=" + token)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            this.setState({
              token: token,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    }
  }

  onTextboxChangeSignIn(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value,
    });
  }
  onTextboxChangeSignUp(event) {
    let name = event.target.name;
    let value = event.target.value;
    console.log(name, value);
    this.setState({
      [name]: value,
    });
  }

  onSignUp(event) {
    const { signUpEmail, signUpUname, signUpPassword } = this.state;
    this.setState({
      isLoading: true,
    });

    fetch("/api/account/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: signUpUname,
        email: signUpEmail,
        password: signUpPassword,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            signUpErr: json.message,
            isLoading: false,
            signUpEmail: "",
            signUpUname: "",
            signUpPassword: "",
          });
        } else {
          this.setState({
            signUpErr: json.message,
            isLoading: false,
          });
        }
      });
  }

  onSignIn(event) {
    const { signInEmail, signInPassword } = this.state;
    this.setState({
      isLoading: true,
    });

    fetch("/api/account/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setInStorage("login_app", { token: json.token });
          this.setState({
            signInErr: json.message,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token,
          });
        } else {
          this.setState({
            signInErr: json.message,
            isLoading: false,
          });
        }
      });
  }

  onLogOut() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage("login_app");
    if (obj && obj.token) {
      const { token } = obj;

      fetch("/api/account/logout?token=" + token)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setInStorage("login_app", { token: "" });
            this.setState({
              token: "",
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
      signUpErr,
      signInErr,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpUname,
      signUpPassword,
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!token) {
      return (
        <div>
          <div>
            <form>
              <div className="imgcontainer">
                <img src="img_avatar2.png" alt="Avatar" className="avatar" />
              </div>

              <div className="container">
                <h1>Sign Up</h1>
                <div>{signUpErr ? <p>{signUpErr}</p> : null} </div>

                <label htmlFor="email">
                  <b>Email</b>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="signUpEmail"
                  value={signUpEmail}
                  onChange={(event) => this.onTextboxChangeSignUp(event)}
                  required
                />

                <label htmlFor="uname">
                  <b>Username</b>
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  name="signUpUname"
                  value={signUpUname}
                  onChange={(event) => this.onTextboxChangeSignUp(event)}
                  required
                />

                <label htmlFor="psw">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="signUpPassword"
                  value={signUpPassword}
                  onChange={(event) => this.onTextboxChangeSignUp(event)}
                  required
                />

                <button onClick={(e) => this.onSignUp(e)} type="submit">
                  Login
                </button>
                <label>
                  <input type="checkbox" name="remember" /> Remember me
                </label>
              </div>

              <div className="container">
                <button type="button" className="cancelbtn">
                  Cancel
                </button>
                <span className="psw">
                  Forgot <a href="#">password?</a>
                </span>
              </div>
            </form>
          </div>
          <div>
            <form>
              <div className="imgcontainer">
                <img src="img_avatar2.png" alt="Avatar" className="avatar" />
              </div>

              <div className="container">
                <h1>Sign In</h1>
                <div>{signInErr ? <p>{signInErr}</p> : null} </div>
                <label htmlFor="email">
                  <b>Email</b>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="signInEmail"
                  value={signInEmail}
                  onChange={(event) => this.onTextboxChangeSignIn(event)}
                  required
                />

                <label htmlFor="psw">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="signInPassword"
                  value={signInPassword}
                  onChange={(event) => this.onTextboxChangeSignIn(event)}
                  required
                />

                <button onClick={(e) => this.onSignIn(e)} type="submit">
                  Login
                </button>
                <label>
                  <input type="checkbox" name="remember" /> Remember me
                </label>
              </div>

              <div className="container">
                <button type="button" className="cancelbtn">
                  Cancel
                </button>
                <span className="psw">
                  Forgot <a href="#">password?</a>
                </span>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p>Account</p>
        <button onClick={(e) => this.onLogOut(e)}>Logout</button>
      </div>
    );
  }
}

export default Home;
