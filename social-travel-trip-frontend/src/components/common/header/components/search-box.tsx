'use client';
import { decodeURIUtil } from '@/lib/utils/decode-uri.util';
import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, AutoCompleteProps, Input } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

export default function SearchBox() {
  const router = useRouter();
  const params = useParams<{ search: string }>();
  const searchMemo = useMemo(() => {
    return decodeURIUtil(params.search);
  }, [params.search]);

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  const onSelect = (data: string) => {
    if (!data) return;
    router.push(`/tim-kiem/${data}`);
  };

  return (
    // <AutoComplete
    //   defaultValue={params.search}
    //   onSelect={onSelect}
    //   onSearch={(text) => setOptions(getPanelValue(text))}
    //   options={options}
    //   className="w-96"
    //   placeholder="Tìm truyện, tác giả..."
    //   prefix={<SearchOutlined />}
    // />
    // <div className="flex items-center w-full max-w-md">
    <Input
      className="grow"
      prefix={<SearchOutlined />}
      placeholder="Tìm tên truyện..."
      defaultValue={searchMemo}
      onPressEnter={(e) => onSelect(e.currentTarget.value)}
    />
    // </div>
  );
}
