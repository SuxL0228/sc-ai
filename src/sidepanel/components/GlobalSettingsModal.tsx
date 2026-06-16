import React, { useMemo } from 'react';
import { Button, Flex, Modal, Select, Switch } from 'antd';
import { useStore } from '../store';

interface Props {
  open: boolean;
  onClose: () => void;
  sidebarWidth?: number;
}

const GlobalSettingsModal: React.FC<Props> = ({ open, onClose, sidebarWidth = 0 }) => {
  const isDebugEnabled = useStore(s => s.isDebugEnabled);
  const summaryProviderId = useStore(s => s.summaryProviderId);
  const summaryCustomPrompt = useStore(s => s.summaryCustomPrompt);
  const enabledMap = useStore(s => s.enabledMap);

  const {
    toggleDebug, setSummaryProviderId,
    setSummaryCustomPrompt, resetSummaryPrompt,
  } = useStore.getState();
  const summaryProviderOptions = useMemo(
    () => useStore.getState().getSummaryProviderOptions(),
    [enabledMap],
  );

  // 计算弹框宽度：侧边栏宽度超过 500px 时随动，最小 400px，最大 800px
  const modalWidth = sidebarWidth > 500
    ? Math.max(400, Math.min(sidebarWidth - 100, 800))
    : 400;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="全局设置"
      footer={null}
      width={modalWidth}
      centered
      maskClosable={false}  // 禁用点击遮罩关闭
      keyboard={false}  // 禁用 ESC 键关闭
    >
      <Flex vertical gap={20} style={{ paddingTop: 8 }}>
        <Flex vertical gap={10}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>归纳总结配置</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            选择一个网页 AI 作为归纳总结通道。触发总结时，系统会在该 AI 页面中新开一轮对话，并把你的自定义总结提示词与各通道回答一起提交给它。
          </div>
          <Flex vertical gap={8}>
            <Select
              value={summaryProviderId || undefined}
              options={summaryProviderOptions}
              onChange={setSummaryProviderId}
              placeholder="选择总结 AI"
              style={{ width: '100%' }}
              notFoundContent="当前没有可用的网页总结 AI"
            />
          </Flex>
        </Flex>

        <Flex vertical gap={10}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>自定义总结提示词</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            定制归纳总结的风格和输出格式。执行总结时，系统会自动把原问题和各 AI 回答拼接在提示词后发给你选择的总结 AI。
          </div>
          <Flex vertical gap={8}>
            <textarea
              value={summaryCustomPrompt}
              onChange={(e) => setSummaryCustomPrompt(e.target.value)}
              placeholder="输入自定义总结提示词..."
              rows={12}
              style={{
                width: 'calc(100% - 16px)',
                padding: '8px 12px',
                fontSize: 13,
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
            <Flex justify="flex-end">
              <Button
                size="small"
                onClick={resetSummaryPrompt}
              >
                恢复默认提示词
              </Button>
            </Flex>
          </Flex>
        </Flex>

        <Flex justify="space-between" align="center">
          <Flex vertical gap={2}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>调试模式</span>
            <span style={{ fontSize: 12, color: '#999' }}>开启后在控制台输出详细日志</span>
          </Flex>
          <Switch checked={isDebugEnabled} onChange={toggleDebug} size="small" />
        </Flex>
      </Flex>
    </Modal>
  );
};

export default GlobalSettingsModal;
