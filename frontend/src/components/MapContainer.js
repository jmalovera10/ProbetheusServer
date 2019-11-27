import React, {Component} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            placeInfo: {}
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
    }

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            placeInfo: props.name,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={12}
                initialCenter={{
                    lat: 4.60971,
                    lng: -74.08175
                }}
                onReady={() => (this.setState({ready: true}))}
                onClick={this.onMapClicked}
            >
                {
                    this.state.ready && this.props.measurements ?
                        this.props.measurements.map((m) => {
                            return (
                                <Marker
                                    key={m.ID}
                                    position={{
                                        lat: m.LATITUDE,
                                        lng: m.LONGITUDE
                                    }}
                                    icon={{
                                        url: (
                                            m.VALUE_MEASURED > m.MAX_VALUE || (m.MIN_VALUE && m.VALUE_MEASURED < m.MIN_VALUE) ?
                                                '/danger-placeholder.png'
                                                : '/safe-placeholder.png'

                                        ),
                                        scaledSize: new this.props.google.maps.Size(64, 90)
                                    }}
                                    name={m}
                                    onClick={this.onMarkerClick}
                                />
                            )
                        })
                        : null
                }
                {
                    this.state.ready && this.props.measurements ?
                        <InfoWindow
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}>
                            {
                                this.state.selectedPlace.name ?
                                    <div>
                                        <h2>{this.state.placeInfo.NAME}</h2>
                                        <h3>
                                            {(() => {
                                                let measurementTime = new Date(this.state.placeInfo.MEASUREMENT_TIME);
                                                console.log(measurementTime);
                                                return (
                                                    `${measurementTime.getUTCDate()}/${measurementTime.getUTCMonth()}/${measurementTime.getFullYear()} - ${measurementTime.getHours()}:${measurementTime.getMinutes() < 10 ? '0' : ''}${measurementTime.getMinutes()}`
                                                )
                                            })()}
                                        </h3>
                                        <h3>
                                            Valor: {`${this.state.placeInfo.VALUE_MEASURED.toFixed(2)} ${this.state.placeInfo.UNITS}`}
                                        </h3>
                                        <h3>
                                            Estado: {
                                            (
                                                this.state.placeInfo.VALUE_MEASURED > this.state.placeInfo.MAX_VALUE || (this.state.placeInfo.MIN_VALUE && this.state.placeInfo.VALUE_MEASURED < this.state.placeInfo.MIN_VALUE) ?
                                                    'PELIGROSO'
                                                    : 'NORMAL'
                                            )
                                        }
                                        </h3>
                                    </div>
                                    : null
                            }

                        </InfoWindow>
                        : null
                }
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: (process.env.GOOGLE_KEY)
})(MapContainer)
