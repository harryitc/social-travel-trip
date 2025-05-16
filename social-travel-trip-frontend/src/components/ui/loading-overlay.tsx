import { Spin } from 'antd';

type TProps = {
  isLoading: boolean;
  children: React.ReactNode;
};

export default function LoadingOverlay({ isLoading, children }: TProps) {
  return (
    <div className="relative">
      {/* Nội dung được blur khi loading */}
      <div className={isLoading ? 'filter blur-xs' : ''}>{children}</div>
      {/* Overlay loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}
