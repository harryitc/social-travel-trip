import * as React from 'react'
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import lgthumbnail from 'lightgallery/plugins/thumbnail';

import lgrotate from 'lightgallery/plugins/rotate';
import lghash from 'lightgallery/plugins/hash';
import lgvimeoThumbnail from 'lightgallery/plugins/vimeoThumbnail';
import _ from 'lodash';
import { InitDetail } from 'lightgallery/lg-events';

interface InterfaceLightGalleryCustom {

    /**
     * Chỉ định class cần selector
     * 
     * Mặc định sẽ là các item con (cùng cấp với nhau)
     */
    selector?: string;

    /**
     * Dùng để selector từ ngoài vào tới trong các item cần selector
     */
    selectWithin?: string;

    /**
     * ClassName cho gallery
     */
    addClass?: string;

    /**
     * ClassName cho modal slide
     */

    elementClassNames?: string;

    /**
     * Dùng để ẩn hiện toogle thumbnail
     */
    allowMediaOverlap?: boolean;

    /**
     * 
     */
    container?: HTMLElement | '';

    /**
     * Dùng để cho phép component này setState hay không
     */
    stateFull?: boolean;

    children?: React.ReactNode;
}

/**
 * Phú
 * -
 * 
 * Dùng để view Gallery cho hình ảnh, video, file PDF,...
 * 
 * Cấu trúc mặc định
* @example
* HTML:
* <LightGalleryCustom>
*     <a key={index} className="" data-src="" href="" data-download-url=""></a>
*     <a key={index} className="" data-src="" href="" data-download-url=""></a>
* </LightGalleryCustom>
 */
class LightGalleryCustom extends React.Component<InterfaceLightGalleryCustom, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            selector: props.selector ?? null,
            selectWithin: props.selectWithin ?? null,
            addClass: props.addClass ?? null,
            elementClassNames: props.elementClassNames ?? null,
            allowMediaOverlap: props.allowMediaOverlap ?? false,
            container: props.container ?? '',
            stateFull: props.stateFull ?? false,
            children: props.children,
        }
    }

    shouldComponentUpdate(nextProps: Readonly<InterfaceLightGalleryCustom>, nextState: Readonly<any>): boolean {
        return this.state.stateFull;
    }

    render() {
        let { selector, addClass, elementClassNames, allowMediaOverlap, selectWithin, container, children } = this.state
        return (
            <LightGallery
                plugins={[lgZoom, lgVideo, lgthumbnail, lgrotate, lghash, lgvimeoThumbnail]}
                mode="lg-fade"
                selector={selector}
                selectWithin={selectWithin}
                addClass={addClass}
                elementClassNames={elementClassNames}

                showZoomInOutIcons={true}
                actualSize={false}
                actualSizeIcons={{ zoomIn: 'lg-actual-size', zoomOut: 'lg-zoom-out' }}
                zoomPluginStrings={{ zoomIn: 'Phóng to', zoomOut: 'Thu nhỏ', viewActualSize: 'Kích thước ban đầu' }}
                zoomFromOrigin={true}
                zoom={true}
                infiniteZoom={true}
                enableZoomAfter={1}

                speed={500}
                download={false}
                hideBarsDelay={3 * 1000}
                showBarsAfter={3 * 1000}

                animateThumb={true}
                thumbnail={true}
                toggleThumb={true}
                allowMediaOverlap={allowMediaOverlap}

                videojs={true}
                videojsOptions={
                    {
                        autoplay: true,
                        muted: false
                    }
                }

                container={container}
                licenseKey={'Meomeo'}
            >
                {children}
            </LightGallery>
        )
    }

}

export default LightGalleryCustom