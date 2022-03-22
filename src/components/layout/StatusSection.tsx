import React from 'react';
import { Difficulty } from '../Difficulty';
import { Numbers } from '../Numbers';

type StatusSectionProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  onClickNumber: (number: string) => void,
  onClickUndo: () => void,
  onClickErase: () => void,
  onClick: () => void,
};

export const StatusSection = (props: StatusSectionProps) => {
  return (
    <section className="status">
      <Numbers onClickNumber={(number) => props.onClickNumber(number)} />
      <div className="status__actions">
      </div>
      <div className='actions-class'>
        <div className='action-items margin-left' onClick={props.onClickUndo}>Erase</div>
        <div className='action-items' onClick={props.onClickErase}>Clear All</div>
        <div className='action-items margin-right' onClick={props.onClick}>New Game</div>
      </div>
      <div className='dif-action-item'>
        <Difficulty onChange={props.onChange} />
      </div>
    </section>
  )
}
