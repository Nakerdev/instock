import { MouseEvent } from 'react'

import { colors } from '../../styles/theme'

interface ButtonComponentProps {
    text: string;
    onClickHandler: (event: MouseEvent<HTMLElement>) => void;
    isDisabled: boolean;
    buttonInnerImgSrc?: string;
    textColor?: string;
    bgColor?: string;
    width?: string;
}

export default function Button (props: ButtonComponentProps) {
  return (
        <>
        <button className="cta" onClick={e => props.onClickHandler(e)} disabled={props.isDisabled}>
            {
                props.isDisabled
                  ? <img src='/gifs/eclipse-white.gif'></img>
                  : props.buttonInnerImgSrc
                    ? props.text
                      ? <span><img src={props.buttonInnerImgSrc}></img>{props.text}</span>
                      : <img src={props.buttonInnerImgSrc}></img>
                    : <span>{props.text}</span>
            }
        </button>
        <style jsx>{`
            .cta {
                color: ${props.textColor ? props.textColor : colors.white};
                background-color: ${props.bgColor ? props.bgColor : colors.CTA};
                width: 100%;
                ${props.width && `width: ${props.width };`}
                border: 0;
                border-radius: 5px;
                font-size: 18px;
                cursor: pointer;
                margin-bottom: 5px;
                ${
                    props.text === ''
                        ? `
                            width: 35px;
                            height: 35px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `
                        : `
                            height: 50px;
                        `
                }
            }

            .cta:disabled  {
                cursor: wait;
                opacity: 80%;
            }

            .cta:disabled > img {
                width: 30px;
            }

            .cta > span > img,
            .cta > img
             {
                filter: invert(1);
                position: absolute;
                ${
                    props.text !== ''
                        ? `
                            margin-left: -30px;
                            margin-top: -3px;
                        `
                        : ''
                }
            }
        `}</style>
        </>
  )
}
