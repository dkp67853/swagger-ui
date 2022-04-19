import React, { cloneElement } from "react"
import PropTypes from "prop-types"

//import "./topbar.less"
import Logo from "./logo_small.svg"
import {parseSearch, serializeSearch} from "../../core/utils"

export default class Topbar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    this.state = { url: props.specSelectors.url(), selectedIndex: 0 }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  flushAuthData() {
    const { persistAuthorization } = this.props.getConfigs()
    if (persistAuthorization)
    {
      return
    }
    this.props.authActions.restoreAuthorization({
      authorized: {}
    })
  }

  loadSpec = (url) => {
    this.flushAuthData()
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }

  onUrlSelect =(e)=> {
    let url = e.target.value || e.target.href
    this.loadSpec(url)
    this.setSelectedUrl(url)
    e.preventDefault()
  }

  downloadUrl = (e) => {
    this.loadSpec(this.state.url)
    e.preventDefault()
  }

  setSearch = (spec) => {
    let search = parseSearch()
    search["urls.primaryName"] = spec.name
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    if(window && window.history && window.history.pushState) {
      window.history.replaceState(null, "", `${newUrl}?${serializeSearch(search)}`)
    }
  }

  setSelectedUrl = (selectedUrl) => {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      if(selectedUrl)
      {
        urls.forEach((spec, i) => {
          if(spec.url === selectedUrl)
            {
              this.setState({selectedIndex: i})
              this.setSearch(spec)
            }
        })
      }
    }
  }

  componentDidMount() {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      var targetIndex = this.state.selectedIndex
      let primaryName = configs["urls.primaryName"]
      if(primaryName)
      {
        urls.forEach((spec, i) => {
          if(spec.name === primaryName)
            {
              this.setState({selectedIndex: i})
              targetIndex = i
            }
        })
      }

      this.loadSpec(urls[targetIndex].url)
    }
  }

  onFilterChange =(e) => {
    let {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render() {
    let { getComponent, specSelectors, getConfigs } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"

    const classNames = ["download-url-input"]
    if (isFailed) classNames.push("failed")
    if (isLoading) classNames.push("loading")

    const { urls } = getConfigs()
    let control = []
    let formOnSubmit = null

    control.push(<a target="_blank" href="https://atdevportalidm.mphrx.com/idm/#/registerUser">SignUp</a>)

    if(urls) {
      let rows = []
      urls.forEach((link, i) => {
        rows.push(<option key={i} value={link.url}>{link.name}</option>)
      })

      control.push(
        <label className="select-label" htmlFor="select"><span>Select a definition</span>
          <select id="select" disabled={isLoading} onChange={ this.onUrlSelect } value={urls[this.state.selectedIndex].url}>
            {rows}
          </select>
        </label>
      )
    }
    else {
      formOnSubmit = this.downloadUrl
      //control.push(<input className={classNames.join(" ")} type="text" onChange={ this.onUrlChange } value={this.state.url} disabled={isLoading} />)
      control.push(
        <>
        <label className="select-label" htmlFor="select"><span>Select a definition</span></label>
        <select id="select" disabled={isLoading} onChange={ this.onUrlSelect }>
          <option value="./examples/Patient.json">Patient</option>
          <option value="./examples/Practitioner.json">Practitioner</option>
          <option value="./examples/Account.json">Account</option>
          <option value="./examples/AllergyIntolerance.json">Allergy Intolerance</option>
          <option value="./examples/Appointment.json">Appointment</option>
          <option value="./examples/CarePlan.json">Care Plan</option>
          <option value="./examples/CareTeam.json">Care Team</option>
          <option value="./examples/ClinicalImpression.json">Clinical Impression</option>
          <option value="./examples/Condition.json">Condition</option>
          <option value="./examples/Coverage.json">Coverage</option>
          <option value="./examples/Device.json">Device</option>
          {/*<option value="./examples/DiagnosticOrder.json">Diagnostic Order</option>   fhir-to-swagger repo don't have DiagnosticOrder*/}
          <option value="./examples/DiagnosticReport.json">Diagnostic Report</option>
          <option value="./examples/DocumentReference.json">Document Reference</option>
          <option value="./examples/Encounter.json">Encounter</option>
          <option value="./examples/FamilyMemberHistory.json">Family Member History</option>
          <option value="./examples/Goal.json">Goal</option>
          <option value="./examples/Immunization.json">Immunization</option>
          <option value="./examples/Location.json">Location</option>
          <option value="./examples/Medication.json">Medication</option>
          <option value="./examples/MedicationRequest.json">Medication Request</option>
          <option value="./examples/Observation.json">Observation</option>
          <option value="./examples/Organization.json">Organization</option>
          <option value="./examples/PractitionerRole.json">Practitioner Role</option>
          <option value="./examples/Procedure.json">Procedure</option>
          <option value="./examples/Provenance.json">Provenance</option>
          <option value="./examples/ServiceRequest.json">Service Request</option>
          <option value="./examples/Task.json">Task</option>
        </select>
        </>

      )
    }

    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link>
              <img height="40" src={ Logo } alt="Swagger UI"/>
            </Link>
            <form className="download-url-wrapper" onSubmit={formOnSubmit}>
              {control.map((el, i) => cloneElement(el, { key: i }))}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired
}
