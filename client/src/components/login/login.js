import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        singUpErr: "",
        signInErr: "",
    };
  }

  componentDidMount() {

  }

  render() {
      const {
          isLoading
      }
    return (
        <div>
            <form>

            </form>
        </div>
    )
  }
}

export default Login;
