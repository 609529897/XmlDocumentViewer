import { FC } from 'react';
import { TransformComponent } from 'react-zoom-pan-pinch';
import { Table } from './Table';

export interface Props {
  current: any;
  width: string
}

export const TableView: FC<Props> = (props) => {
  const { current: table, width } = props;
  return (
    <TransformComponent>
      <div className="h-screen flex justify-center items-center" style={{ width }}>
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <Table item={table} /> 
        </div>
      </div>
    </TransformComponent>
  );
};
