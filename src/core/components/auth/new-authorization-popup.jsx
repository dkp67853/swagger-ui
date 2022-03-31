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
      id: '',
      password: '',
      token: '',
      Bearer: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  loginHandler = () => {
    return fetch("https://webqa1.mphrx.com/minerva/api/login", {
      "method": "POST",
      "headers": {
        "api-info": "V2|appVerson|deviceBrand|deviceModel|deviceScreenResolution|deviceOs|deviceOsVersion|deviceNetworkProvider|deviceNetworkType"
      },
      "body": JSON.stringify({
        username: this.state.id,
        password: this.state.password
      })
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
                  <label>ID </label>
                  <input name="id" id="id" type="text" value={this.state.id} onChange={(e) => this.handleChange({ id: e.target.value })}/>
                </div>
                <div className="wrapper">
                  <label>Password </label>
                  <input name="password" id="password" type="password" value={this.state.password} onChange={(e) => this.handleChange({ password: e.target.value })}/>
                </div>


                {
                  definitions.valueSeq().map(( definition, key ) => {
                    return <Auths token={this.state.token}
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
