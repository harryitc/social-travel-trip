import { Skeleton } from 'antd';

type TProps = {
  template?: TTemplate;
  isLoading?: boolean;
  children?: React.ReactNode;
};

type TTemplate = 1 | 2 | 3 | 4;

export default function DefaultLoading(props: TProps) {
  const { template, isLoading = true, children } = props;

  if (isLoading) {
    switch (template) {
      case 1:
        return <Template1 />;
      case 2:
        return <Template2 />;
      case 3:
        return <Template3 />;
      case 4:
        return <Template4 />;
      default:
        return <Skeleton active />;
    }
  } else {
    return <>{children}</>;
  }
}

function Template1() {
  // Template với nhiều dòng mô tả
  return <Skeleton active paragraph={{ rows: 10 }} />;
}

function Template2() {
  // Template có avatar tròn và vài dòng văn bản
  return (
    <div className="flex items-center gap-4">
      <Skeleton.Avatar active size="large" shape="circle" />
      <div className="flex-1">
        <Skeleton active title={{ width: '50%' }} paragraph={{ rows: 4 }} />
      </div>
    </div>
  );
}

function Template3() {
  // Template với tiêu đề dài và đoạn văn ngắn
  return (
    <Skeleton
      active
      title={{ width: '60%' }}
      paragraph={{ rows: 6, width: ['100%', '80%', '90%', '75%', '80%', '70%'] }}
    />
  );
}

function Template4() {
  // Template với input giả và vài dòng nội dung
  return (
    <div>
      <Skeleton.Input active size="large" className="mb-4" />
      <Skeleton active paragraph={{ rows: 3, width: ['100%', '80%', '90%'] }} />
    </div>
  );
}
