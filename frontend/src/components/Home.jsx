import React, {Component} from 'react';

export default class Home extends Component {

    render() {
        return (
            <div className="jumbotron">
                <h1 className="display-4">Probetheus</h1>
                <p className="lead">Una aplicación para monitorear las aguas y empoderar a la gente de Samacá</p>
                <hr className="my-4"/>
                <p>Ayudamos a los habitantes de Samacá a tener control sobre sus recursos hídricos.</p>
            </div>
        );
    }
}
