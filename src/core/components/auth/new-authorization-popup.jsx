import React from "react"
import PropTypes from "prop-types"

export default class NewAuthorizationPopup extends React.Component {
  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  constructor(props) {
    super(props);
    this.state = {
      client_id: '',
      client_secret: '',
      access_token: '',
      Bearer: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // login(e) {
  //   e.preventDefault()
  //
  //   var details = {
  //     'grant_type':'client_credentials',
  //     'scope':'openid system/*.read',
  //     'client_id':this.state.client_id,
  //     'client_secret':this.state.client_secret
  //   };
  //
  //   var formBody = [];
  //   for (var property in details) {
  //     var encodedKey = encodeURIComponent(property);
  //     var encodedValue = encodeURIComponent(details[property]);
  //     formBody.push(encodedKey + "=" + encodedValue);
  //   }
  //   formBody = formBody.join("&");
  //
  //   fetch("http://localhost:8080/minerva/fhir/oauth2/token", {
  //     "method": "POST",
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: formBody
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       this.setState({
  //         access_token: response.access_token
  //       })
  //       //this.state.token = response.token
  //       console.log(this.state.access_token)
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  loginHandler = () => {
    var details = {
      'grant_type':'client_credentials',
      'scope':'openid system/*.read',
      'client_id':this.state.client_id,
      'client_secret':this.state.client_secret
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return fetch("https://atdevportal.mphrx.com/minerva/fhir/oauth2/token", {
      "method": "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    })
  }

  handleChange(changeObject) {
    this.setState(changeObject)
  }

  render() {
    let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST = {} } } = this.props
    let definitions = authSelectors.shownDefinitions()
    const Auths = getComponent("auths")

    return (
      <div className="dialog-ux">
        <div className="backdrop-ux"></div>
        <div className="modal-ux">
          <div className="modal-dialog-ux">
            <div className="modal-ux-inner">
              <div className="modal-ux-header">
                <h3>Available authorizations</h3>
                <button type="button" className="close-modal" onClick={ this.close }>
                  <svg width="20" height="20">
                    <use href="#close" xlinkHref="#close" />
                  </svg>
                </button>
              </div>
              <div className="modal-ux-content">

                <div className="wrapper">
                  <label>Client ID </label>
                  <input name="client_id" id="client_id" type="text" value={this.state.client_id} onChange={(e) => this.handleChange({ client_id: e.target.value })}/>
                </div>
                <div className="wrapper">
                  <label>Client Secret </label>
                  <input name="client_secret" id="client_secret" type="text" value={this.state.client_secret} onChange={(e) => this.handleChange({ client_secret: e.target.value })}/>
                </div>

                {
                  definitions.valueSeq().map(( definition, key ) => {
                    return <Auths token={this.state.access_token}
                                  key={ key }
                                  AST={AST}
                                  definitions={ definition }
                                  loginHandler={ this.loginHandler }
                                  getComponent={ getComponent }
                                  errSelectors={ errSelectors }
                                  authSelectors={ authSelectors }
                                  authActions={ authActions }
                                  specSelectors={ specSelectors }/>
                  })
                }


              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}
