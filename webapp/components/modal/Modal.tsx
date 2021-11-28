import { PropsWithChildren, MouseEvent } from 'react'

import { colors, fonts } from '../../styles/theme'

interface ModalComponentProps {
    isShown: boolean
    title: string
    onClose: () => void
}

export default function Modal (props: PropsWithChildren<ModalComponentProps>) {
  function handleCloseClick (e: MouseEvent<HTMLElement>): void {
    e.preventDefault()
    props.onClose()
  };

  return (
        <>
        {
            !props.isShown && typeof (document) !== undefined
              ? ''
              : (
                    <div className='overlay'>
                        <div className='modal-container'>
                            <div className='modal-header'>
                                <button className='modal-close-button' onClick={handleCloseClick}>x</button>
                            </div>
                            {props.title && <p className='modal-title'>{props.title}</p>}
                            {props.children}
                        </div>
                    </div>
                )
        }
        <style jsx>{`
            .overlay {
                position: fixed;
                width: 100%;
                height: 100%;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-container {
                max-width: 1000px;
                border-radius: 5px;
                background-color: white;
                padding: 20px;
                background-color: ${colors.white};
                box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
            }

            .modal-close-button {
                border-radius: 15px;
                padding: 7px 11px;
                border: 0;
                float: right;
                cursor: pointer;
            }

            .modal-title {
                font-size: 24px;
                line-height: 1.5rem;
                color: ${colors.black};
                font-family: ${fonts.base};
                margin-bottom: 20px;
            }
        `}</style>
        </>)
};
