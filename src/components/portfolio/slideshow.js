/** @jsx jsx */
import { useState, useEffect, useRef } from 'react'; // Not sure why this is needed, but it is...
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled';
import { Quote } from '../shared/quote';
import { TEST } from './assets';

export const SLIDESHOW_TIME = 14000;
const GREY = '#adadad';

const slideshowAssetStyle = {
    maxWidth: '100%',
    boxSizing: 'border-box',
};

const SlideshowVideo = styled.video(({ isTall }) => ({
    ...slideshowAssetStyle,
    height: isTall && '200px',
}));

export const Slideshow = ({ activeIndex }) => {
    const isInit = useRef(false);

    const data = useStaticQuery(graphql`
        query SlideShowImageQuery {
            barnesSignage: file(relativePath: { eq: "BarnesSignage.jpg" }) {
                childImageSharp {
                    fluid {
                        aspectRatio
                        base64
                        sizes
                        src
                        srcSet
                    }
                }
            }

            barnesTwitch: file(relativePath: { eq: "BarnesTwitch.JPG" }) {
                childImageSharp {
                    fluid {
                        aspectRatio
                        base64
                        sizes
                        src
                        srcSet
                    }
                }
            }

            contactlessTicketing: file(
                relativePath: { eq: "ContactlessTicketing.jpg" }
            ) {
                childImageSharp {
                    fluid {
                        aspectRatio
                        base64
                        sizes
                        src
                        srcSet
                    }
                }
            }
        }
    `);

    const [isTextPhase, setIsTextPhase] = useState(true);
    const [isImagePhase, setIsImagePhase] = useState(true);

    useEffect(() => {
        let stoText;
        let stoTextHide;
        let stoImage;

        if (isInit.current) {
            setIsTextPhase(false);
            setIsImagePhase(false);

            stoText = setTimeout(() => {
                setIsTextPhase(true);

                stoTextHide = setTimeout(() => {
                    setIsTextPhase(false);
                }, SLIDESHOW_TIME - 3000);
            }, 1500);

            stoImage = setTimeout(() => {
                setIsImagePhase(true);
            }, 500);
        } else {
            isInit.current = true;

            stoTextHide = setTimeout(() => {
                setIsTextPhase(false);
            }, SLIDESHOW_TIME - 1000);
        }

        return () => {
            if (stoText) {
                clearTimeout(stoText);
            }

            if (stoTextHide) {
                clearTimeout(stoTextHide);
            }

            if (stoImage) {
                clearTimeout(stoImage);
            }
        };
    }, [activeIndex]);

    return (
        <div
            css={css`
                height: 300px;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                border-bottom: 1px solid ${GREY};
                border-top: 1px solid ${GREY};
            `}
        >
            {TEST.map(({ src, text, isVideo, isTall }, i) => {
                const isActive = activeIndex === i;

                return (
                    <div
                        key={i}
                        css={css`
                            position: absolute;
                        `}
                    >
                        <div
                            css={css`
                                padding: 20px 20px 0;
                                transition: opacity 1s;
                                opacity: ${isActive && isImagePhase ? 1 : 0};
                                display: ${isTall ? 'flex' : 'block'};
                                justify-content: center;
                                box-sizing: border-box;
                            `}
                        >
                            {isVideo ? (
                                <SlideshowVideo
                                    src={src}
                                    muted={true}
                                    loop={true}
                                    autoPlay={true}
                                    isTall={isTall}
                                />
                            ) : (
                                <Img
                                    fluid={data[src].childImageSharp.fluid}
                                    css={{
                                        ...slideshowAssetStyle,
                                        height: isTall && '200px',
                                    }}
                                />
                            )}
                        </div>
                        <Quote
                            css={css`
                                transition: opacity 1s;
                                opacity: ${isActive && isTextPhase ? 1 : 0};
                            `}
                        >
                            {text}
                        </Quote>
                    </div>
                );
            })}
        </div>
    );
};
