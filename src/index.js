import React from 'react'
import PropTypes from 'prop-types';

import {ReactSVGPanZoom} from 'react-svg-pan-zoom';

import Polylines from './components/Polylines'
import Images from './components/Images.js'
import Circles from './components/Circles.js'
import Polygons from './components/Polygons.js'
import Text from './components/Text.js'

import {convertLat, convertLng, reverseLat, reverseLng} from "./components/CoordinateConverter";

import world_map_low from './images/world_map_low.png';
import world_map_medium from './images/world_map_medium.png';
import world_map_high from './images/world_map_high.png';

class Map extends React.Component {

    //TODO: Update text to be an object within circle

    componentDidMount() {
        var init = this.props.initialPos;
        this.Viewer.setPointOnViewerCenter(
            convertLng(init.lng, this.props.width, this.props.bounds),
            convertLat(init.lat, this.props.height, this.props.bounds),
            init.zoom
        );
    }

    clicked(event) {
        this.props.handleClick( {
            'lat': reverseLat(event.y, this.props.height, this.props.bounds),
            'lng': reverseLng(event.x, this.props.width, this.props.bounds),
            'evt': event.originalEvent
        });
    }

    render() {
        var maps = {'low': world_map_low, 'medium': world_map_medium, 'high': world_map_high};
        var images = this.props.images;
        if (this.props.showWorldMap) {
            images.unshift(
                {'url': maps[this.props.mapQuality], 'topLat': 90, 'topLng': -180, 'bottomLat': -90, 'bottomLng': 180}
            );
        }
        var width = this.props.width;
        var height = this.props.height;
        console.log(this.props.bounds);
        return (
            <div>
                {this.props.buttons.map((button, index) => {
                    return (<button key={index} onClick={e => this.Viewer.setPointOnViewerCenter(
                        convertLng(button.lng, width, this.props.bounds),
                        convertLat(button.lat, height, this.props.bounds),
                        button.zoom)}>
                        {button.name}
                    </button>);
                })}

                <ReactSVGPanZoom
                    width={width} height={height}
                    onClick={evt => this.clicked(evt)}
                    detectAutoPan={false}
                    ref={Viewer => this.Viewer = Viewer}>

                    <svg width={width} height={height}>
                        <g>

                            <Images images={images} width={width} height={height} bounds={this.props.bounds}
                            />

                            <Polygons polygons={this.props.polygons} width={width} height={height} bounds={this.props.bounds}
                            />

                            <Polylines paths={this.props.polylines} width={width} height={height} bounds={this.props.bounds}
                            />

                            <Circles circles={this.props.circles} width={width} height={height} bounds={this.props.bounds}
                            />

                            <Text text={this.props.text} width={width} height={height} bounds={this.props.bounds}
                            />

                        </g>
                    </svg>

                </ReactSVGPanZoom>
            </div>
        )
    }
}

Map.propTypes = {
    mapQuality: PropTypes.oneOf(['low', 'medium', 'high']),
    images: PropTypes.arrayOf(PropTypes.object),
    polylines: PropTypes.arrayOf(PropTypes.object),
    circles: PropTypes.arrayOf(PropTypes.object),
    buttons: PropTypes.arrayOf(PropTypes.object),
    polygons: PropTypes.arrayOf(PropTypes.object),
    text: PropTypes.arrayOf(PropTypes.object),
    showWorldMap: PropTypes.bool,
    initialPos: PropTypes.objectOf(PropTypes.number),
    bounds: PropTypes.objectOf(PropTypes.number),
    onClick: PropTypes.func,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired

};

Map.defaultProps = {
    mapQuality: 'medium',
    text: [],
    images: [],
    polylines: [],
    circles: [],
    buttons: [],
    polygons: [],
    showWorldMap: true,
    initialPos: {'lat': 0, 'lng': 0, 'zoom': 1},
    bounds: {'topLat': 90, 'topLng': -180, 'bottomLat': -90, 'bottomLng': 180},
    handleClick: () => {}
};

export default Map;