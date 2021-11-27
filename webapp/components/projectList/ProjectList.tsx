import { colors, fonts } from '../../styles/theme'
import Button from '../button/Button'

export {
    ProjectList,
    Project 
}

interface ProjectListComponentProps {
    projects: Project[];
}

class Project {
    readonly id: string
    readonly name: string

    constructor(id: string, name: string){
        this.id = id
        this.name = name
    }
}

function ProjectList(props: ProjectListComponentProps) {
    return (
        <>
        <section>
          {
            props.projects.map(project => {
              return (
                <article className='project-container'>
                  <p>{project.name}</p>
                  <div>
                    <Button 
                      text='' 
                      onClickHandler={() => {}} 
                      bgColor={colors.grey} 
                      isDisabled={false} 
                      buttonInnerImgSrc='/icons/pencil.svg'
                    />
                    <Button 
                      text='' 
                      onClickHandler={() => {}} 
                      bgColor={colors.grey} 
                      isDisabled={false} 
                      buttonInnerImgSrc='/icons/trash.svg'
                    />
                  </div>
                  
                </article>
              )
            })
          }
        </section>
        <style jsx>{`
          section {
            width: 100%
          }

          article {
            width: 100%;
            background-color: ${colors.blue};
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding: 10px 0px;
            border-radius: 5px;
          }

          article > p {
            margin-left: 5px;
            display: block;
            font-family: ${fonts.base};
          }

          article > div {
            width: 100px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-top: 10px;
          }
        `}</style>
        </>
    )
}