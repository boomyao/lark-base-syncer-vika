"use client";

import { Button, ConfigProvider, Form, Input, message } from 'antd'
import { useState } from 'react';
import { Vika } from '@vikadata/vika'
import { bitable } from '@lark-base-open/connector-api';

const FormItem = Form.Item

export default function Home() {
  const [vikaToken, setVikaToken] = useState('')
  const [datasheetId, setDatasheetId] = useState('')
  const [messager, messageHolder] = message.useMessage()

  const handleSubmitClick = async () => {
    try {
      const vika = new Vika({ token: vikaToken })
      const res = await vika.datasheet(datasheetId).views.list()
      const name = res.data?.views[0].name || '维格表';

      bitable.saveConfigAndGoNext({
        vikaToken,
        datasheetId,
        datasheetName: name
      })
    } catch {
      messager.error('API令牌或维格表 ID 错误')
    }
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#7b67ee' } }}>
      {messageHolder}
      <Form>
        <FormItem label="API令牌">
          <Input type="password" placeholder='usxx**********xxxx' value={vikaToken} onChange={e => setVikaToken(e.target.value)} />
        </FormItem>
        <FormItem label="维格表">
          <Input type="text" placeholder='维格表 ID' value={datasheetId} onChange={e => setDatasheetId(e.target.value)} />
        </FormItem>
        <FormItem className=' float-end'>
          <Button type="primary" onClick={handleSubmitClick}>开始同步</Button>
        </FormItem>
      </Form>
    </ConfigProvider>
  );
}
