import React, {Component} from 'react';
import MapContainer from './MapContainer';
import axios from 'axios';
import './Home.css';

export default class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            measurments: []
        }
    }

    componentDidMount() {
        axios.get('/API/measurements')
            .then((res)=>{
                return res.data
            })
            .then((data)=>{
                this.setState({
                    measurements: data
                })
            })
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-light bg-light">
                    <a className="navbar-brand">
                        <img src="/icon.png" width="30" height="30" className='logo_icon'
                             className="d-inline-block align-top" alt=""/>
                        <b className='title'>
                            Probetheus
                        </b>
                    </a>
                </nav>
                <div className="jumbotron">
                    <h1 className="display-4">Probetheus</h1>
                    <p className="lead">Una aplicación para monitorear las aguas y empoderar a la gente de Samacá</p>
                </div>
                <div className='row'>
                    <MapContainer measurements={this.state.measurements}/>
                </div>
            </div>
        );
    }
}
