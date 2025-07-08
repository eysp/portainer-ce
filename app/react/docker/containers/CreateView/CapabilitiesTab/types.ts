export interface Capability {
  key: string;
  description: string;
  default?: boolean;
}

const capDesc: Array<Capability> = [
  {
    key: 'SETPCAP',
    description: '修改进程权限。',
    default: true,
  },
  {
    key: 'MKNOD',
    description: '使用 mknod(2) 创建特殊文件。',
    default: true,
  },
  {
    key: 'AUDIT_WRITE',
    description: '向内核审计日志写入记录。',
    default: true,
  },
  {
    key: 'CHOWN',
    description: '对文件的用户 ID 和组 ID 进行任意更改（参见 chown(2)）。',
    default: true,
  },
  {
    key: 'NET_RAW',
    description: '使用 RAW 和 PACKET 套接字。',
    default: true,
  },
  {
    key: 'DAC_OVERRIDE',
    description: '绕过文件的读取、写入和执行权限检查。',
    default: true,
  },
  {
    key: 'FOWNER',
    description: '绕过需要进程文件系统 UID 与文件 UID 匹配的操作权限检查。',
    default: true,
  },
  {
    key: 'FSETID',
    description: '当文件被修改时，不清除 set-user-ID 和 set-group-ID 权限位。',
    default: true,
  },
  {
    key: 'KILL',
    description: '绕过发送信号的权限检查。',
    default: true,
  },
  {
    key: 'SETGID',
    description: '对进程的 GID 和附加 GID 列表进行任意操作。',
    default: true,
  },
  {
    key: 'SETUID',
    description: '对进程的 UID 进行任意操作。',
    default: true,
  },
  {
    key: 'NET_BIND_SERVICE',
    description: '将套接字绑定到特权端口（小于 1024 的端口号）。',
    default: true,
  },
  {
    key: 'SYS_CHROOT',
    description: '使用 chroot(2)，更改根目录。',
    default: true,
  },
  {
    key: 'SETFCAP',
    description: '设置文件权限。',
    default: true,
  },
  {
    key: 'SYS_MODULE',
    description: '加载和卸载内核模块。',
  },
  {
    key: 'SYS_RAWIO',
    description: '执行 I/O 端口操作（iopl(2) 和 ioperm(2)）。',
  },
  {
    key: 'SYS_PACCT',
    description: '使用 acct(2)，开启或关闭进程统计。',
  },
  {
    key: 'SYS_ADMIN',
    description: '执行一系列系统管理操作。',
  },
  {
    key: 'SYS_NICE',
    description: '提升进程优先级（nice(2), setpriority(2)）并更改任意进程的 nice 值。',
  },
  {
    key: 'SYS_RESOURCE',
    description: '覆盖资源限制。',
  },
  {
    key: 'SYS_TIME',
    description: '设置系统时钟（settimeofday(2), stime(2), adjtimex(2)）；设置实时时钟。',
  },
  {
    key: 'SYS_TTY_CONFIG',
    description: '使用 vhangup(2)；对虚拟终端执行特权 ioctl(2) 操作。',
  },
  {
    key: 'AUDIT_CONTROL',
    description: '启用或禁用内核审计；更改审计过滤规则；获取审计状态和过滤规则。',
  },
  {
    key: 'MAC_ADMIN',
    description: '允许 MAC 配置或状态更改。为 Smack LSM 实现。',
  },
  {
    key: 'MAC_OVERRIDE',
    description: '绕过强制访问控制（MAC）。为 Smack Linux 安全模块实现。',
  },
  {
    key: 'NET_ADMIN',
    description: '执行各种网络相关操作。',
  },
  {
    key: 'SYSLOG',
    description: '执行特权的 syslog(2) 操作。',
  },
  {
    key: 'DAC_READ_SEARCH',
    description: '绕过文件读取权限检查和目录读取及执行权限检查。',
  },
  {
    key: 'LINUX_IMMUTABLE',
    description: '设置 FS_APPEND_FL 和 FS_IMMUTABLE_FL i-node 标志。',
  },
  {
    key: 'NET_BROADCAST',
    description: '进行套接字广播，监听组播。',
  },
  {
    key: 'IPC_LOCK',
    description: '锁定内存（mlock(2), mlockall(2), mmap(2), shmctl(2)）。',
  },
  {
    key: 'IPC_OWNER',
    description: '绕过对 System V IPC 对象操作的权限检查。',
  },
  {
    key: 'SYS_PTRACE',
    description: '使用 ptrace(2) 追踪任意进程。',
  },
  {
    key: 'SYS_BOOT',
    description: '使用 reboot(2) 和 kexec_load(2)，重启并加载新内核。',
  },
  {
    key: 'LEASE',
    description: '对任意文件建立租约（参见 fcntl(2)）。',
  },
  {
    key: 'WAKE_ALARM',
    description: '触发可唤醒系统的事件。',
  },
  {
    key: 'BLOCK_SUSPEND',
    description: '使用可阻止系统挂起的功能。',
  },
];

export const capabilities = capDesc.sort((a, b) => (a.key < b.key ? -1 : 1));
