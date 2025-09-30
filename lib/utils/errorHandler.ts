// 全局错误处理器

export const setupGlobalErrorHandler = () => {
  // 捕获未处理的错误
  window.addEventListener('error', (event) => {
    const error = event.error
    
    // 忽略 React DOM 操作错误
    if (error && (
      error.message?.includes('insertBefore') ||
      error.message?.includes('removeChild') ||
      error.message?.includes('Node') ||
      error.message?.includes('要删除的节点不是该节点的子节点')
    )) {
      console.warn('Suppressing React DOM manipulation error:', error.message)
      event.preventDefault()
      return false
    }
  })

  // 捕获未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    
    // 忽略钱包相关的用户取消错误
    if (reason && (
      reason.message?.includes('User rejected') ||
      reason.message?.includes('用户拒绝') ||
      reason.code === 4
    )) {
      console.warn('User cancelled wallet operation:', reason.message)
      event.preventDefault()
      return false
    }
  })

  console.log('Global error handlers initialized')
}

// 检查是否为 React DOM 错误
export const isReactDOMError = (error: Error): boolean => {
  return !!(error.message?.includes('insertBefore') ||
           error.message?.includes('removeChild') ||
           error.message?.includes('Node') ||
           error.message?.includes('要删除的节点不是该节点的子节点'))
}

// 检查是否为用户取消的钱包操作
export const isUserCancelledError = (error: any): boolean => {
  return !!(error.message?.includes('User rejected') ||
           error.message?.includes('用户拒绝') ||
           error.code === 4)
}