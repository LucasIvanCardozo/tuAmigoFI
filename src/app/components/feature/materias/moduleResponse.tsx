'use client'
import { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import PdfView from '@/app/components/pdfView'
import { BiSolidRightArrowSquare, BiSolidLeftArrowSquare } from 'react-icons/bi'
import { FaCommentDots } from 'react-icons/fa'
import { DataModuleProblem } from '@/app/types'
import { Code } from './code'
import { CommentsLi } from './commentsLi'
import { CgMathMinus, CgMathPlus } from 'react-icons/cg'
import { ModalDeleteResponse } from '../../layout/modals/modalDeleteResponse'
import ButtonReaction from './buttonReaction'
import { Session } from 'next-auth'

export default function ModuleResponse({
  problem,
  session,
  typeModule,
}: {
  problem: DataModuleProblem
  session: Session | null
  typeModule: 'TP' | 'Practica'
}) {
  const [indexResponse, setIndexResponse] = useState<number>(0)
  const [stateComment, setStateComment] = useState(false)
  const [viewResponses, setViewResponses] = useState(false)

  const responses = problem.responses
  const isTp = typeModule == 'TP'

  const handlePageUser = (add: number) => {
    const suma = indexResponse + add
    if (!(suma >= problem.responses.length || suma < 0)) {
      setIndexResponse(suma)
    }
  }

  const handleComment = () => {
    setStateComment(!stateComment)
  }

  return (
    <li className="mx-2 my-1">
      {viewResponses ? (
        <>
          <div className="relative bg-(--white) text-base leading-5 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.5)] flex flex-col min-h-32">
            <span className="bg-[#C8E0E4] flex justify-between items-center">
              <b className="bg-[#9fc8cf] p-1">{`Ejercicio ${problem.number}:`}</b>
              <span className="opacity-75 p-1 flex gap-1">
                Por {`${responses[indexResponse].user.name}`}
                <button onClick={() => setViewResponses(!viewResponses)}>
                  <CgMathMinus className="text-xl " />
                </button>
              </span>
            </span>
            <div className="w-full h-5 relative flex justify-between">
              {(session?.user.tier == 2 || session?.user.id == responses[indexResponse].response.idUser) && (
                <ModalDeleteResponse response={responses[indexResponse].response} user={responses[indexResponse].user} />
              )}
              <span></span>
              <div className="flex gap-1">
                <button
                  className="h-full aspect-square text-(--black-olive) opacity-90"
                  aria-label="Cambiar usuario que respondió hacia la izquierda"
                  title="Cambiar hacia izquierda"
                  onClick={() => handlePageUser(-1)}
                >
                  <BiSolidLeftArrowSquare className="h-full w-full" />
                </button>
                <span className="text-nowrap">{`${indexResponse + 1} de ${responses.length}`}</span>
                <button
                  className="h-full aspect-square text-(--black-olive) opacity-90"
                  aria-label="Cambiar usuario que respondió hacia la derecha"
                  title="Cambiar hacia derecha"
                  onClick={() => handlePageUser(1)}
                >
                  <BiSolidRightArrowSquare className="h-full w-full" />
                </button>
              </div>
            </div>
            {responses[indexResponse].response.type == 'TEXT' ? (
              <div className="whitespace-pre px-2 pb-7">
                <p>{responses[indexResponse].response.text}</p>
              </div>
            ) : responses[indexResponse].response.type == 'IMAGE' ? (
              <div className="relative flex justify-center w-full max-h-250 pb-7">
                <CldImage
                  src={`https://res.cloudinary.com/donzj5rlf/image/upload/f_auto,q_auto/v${Math.floor(
                    Date.now() / (1000 * 60 * 60 * 24 * 7)
                  )}/${isTp ? 'tps' : 'parciales'}/respuestas/${isTp ? responses[indexResponse].response.idTp : responses[indexResponse].response.idMidterm}/${responses[indexResponse].response.number}/${
                    responses[indexResponse].response.idUser
                  }`}
                  alt=""
                  width="500"
                  height="500"
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </div>
            ) : responses[indexResponse].response.type == 'PDF' ? (
              <div className="relative overflow-hidden bg-[#C8E0E4] h-min max-w-full py-1 pb-7 rounded-md sm:p-1">
                <PdfView
                  id={responses[indexResponse].response.idUser}
                  url={`${isTp ? 'tps' : 'parciales'}/respuestas/${isTp ? responses[indexResponse].response.idTp : responses[indexResponse].response.idMidterm}/${responses[indexResponse].response.number}`}
                />
              </div>
            ) : responses[indexResponse].response.type == 'CODE' ? (
              <div className="bg-gray-900 p-3 text-white rounded-md overflow-x-auto pb-7">
                <Code code={responses[indexResponse].response.text ?? ''} />
              </div>
            ) : null}
            <div className="flex absolute bottom-0 right-0 z-10 gap-1 p-1 bg-(--white) rounded-md select-none">
              <ButtonReaction indexResponse={indexResponse} responses={responses} />|
              <button onClick={handleComment}>
                <FaCommentDots className="text-xl" />
              </button>
              {responses[indexResponse].comments.length}
            </div>
          </div>
          {stateComment && <CommentsLi comments={responses[indexResponse].comments} response={responses[indexResponse].response} session={session} />}
        </>
      ) : (
        <div className="relative bg-(--white) text-base leading-5 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.5)] flex flex-col">
          <span className="bg-[#C8E0E4] flex justify-between items-center">
            <b className=" p-1">{`Ejercicio ${problem.number}`}</b>
            <span className="opacity-75 p-1 flex gap-1">
              {`Hay ${responses.length} respuesta disponible`}
              <button onClick={() => setViewResponses(!viewResponses)}>
                <CgMathPlus className="text-xl " />
              </button>
            </span>
          </span>
        </div>
      )}
    </li>
  )
}
