import { MouseEvent } from 'react'

import { colors } from '../../styles/theme'

interface CTAComponentProps {
    text: string;
    onClickHandler: (event: MouseEvent<HTMLElement>) => void;
    isDisabled: boolean;
    buttonInnerImgSrc?: string;
}

export default function CTA(props: CTAComponentProps) {
    return (
        <>
        <button className="cta" onClick={e => props.onClickHandler(e)} disabled={props.isDisabled}>
            {
                props.isDisabled
                    ? <img src='/gifs/eclipse-white.gif'></img>
                    : props.buttonInnerImgSrc 
                        ? <span><img src={props.buttonInnerImgSrc}></img>{props.text}</span>
                        : <span>{props.text}</span>
            }
        </button>
        <style jsx>{`
            .cta {
                color: ${colors.white};
                background-color: ${colors.CTA};
                width: 100%;
                height: 50px;
                border: 0;
                border-radius: 5px;
                font-size: 18px;
                cursor: pointer;
                margin-bottom: 5px;
            }

            .cta:disabled  {
                cursor: wait;
                opacity: 80%;
            }

            .cta:disabled > img {
                width: 30px;
            }

            .cta > span > img {
                filter: invert(1);
                position: absolute;
                margin-left: -30px;
                margin-top: -3px;
            }
        `}</style>
        </>
    )
}