import React from 'react';
import { ReactComponent } from '../../ReactComponent';
import './Image.less';

export class Image extends ReactComponent {
    img: React.RefObject<any>;

    constructor(props) {
        super(props);
        this.img = React.createRef();
        this.state = { classList: null };
    }

    getNaturalSize() {
        return [this.img.current.naturalWidth, this.img.current.naturalHeight];
    }

    onImgClick = async (e) => {
        console.log('Image.onImgClick');
        if (this.props.onClick) {
            return await this.props.onClick();
        }
        this.setState((prevState) => {
            if (prevState.classList) {
                return { classList: null };
            } else {
                return { classList: ['Image_full'] };
            }
        });
    };

    render() {
        return (
            <img
                className={this.getCssClassNames()}
                ref={this.img}
                src={this.props.src}
                onClick={this.onImgClick}
            />
        );
    }

    /*componentDidMount() {
        console.log('Image.componentDidMount', this.getNaturalSize());
    }*/
}

// @ts-ignore
window.Image = Image;
