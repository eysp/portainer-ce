export interface Capability {
  key: string;
  description: string;
  default?: boolean;
}

const capDesc: Array<Capability> = [
  {
    key: 'SETPCAP',
    description: '修改进程能力。',
    default: true,
  },
  {
    key: 'MKNOD',
    description: '使用 mknod(2) 创建特殊文件。',
    default: true,
  },
  {
    key: 'AUDIT_WRITE',
    description: '写入内核审计日志。',
    default: true,
  },
  {
    key: 'CHOWN',
    description: '对文件的 UID 和 GID 做任意修改（见 chown(2)）。',
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
    description:
      '绕过对需要文件系统 UID 与进程 UID 匹配的操作的权限检查。',
    default: true,
  },
  {
    key: 'FSETID',
    description:
      '修改文件时不清除 set-user-ID 和 set-group-ID 权限位。',
    default: true,
  },
  {
    key: 'KILL',
    description: '绕过发送信号的权限检查。',
    default: true,
  },
  {
    key: 'SETGID',
    description:
      '对进程 GID 和附加 GID 列表进行任意操作。',
    default: true,
  },
  {
    key: 'SETUID',
    description: '对进程 UID 进行任意操作。',
    default: true,
  },
  {
    key: 'NET_BIND_SERVICE',
    description:
      '将套接字绑定到互联网域特权端口（端口号小于 1024）。',
    default: true,
  },
  {
    key: 'SYS_CHROOT',
    description: '使用 chroot(2)，更改根目录。',
    default: true,
  },
  {
    key: 'SETFCAP',
    description: '设置文件能力。',
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
    description: '使用 acct(2)，开启或关闭进程会计。',
  },
  {
    key: 'SYS_ADMIN',
    description: '执行一系列系统管理操作。',
  },
  {
    key: 'SYS_NICE',
    description:
      '提升进程的优先级值（nice(2), setpriority(2)），并更改任意进程的优先级值。',
  },
  {
    key: 'SYS_RESOURCE',
    description: '覆盖资源限制。',
  },
  {
    key: 'SYS_TIME',
    description:
      '设置系统时钟（settimeofday(2)，stime(2)，adjtimex(2)）；设置实时（硬件）时钟。',
  },
  {
    key: 'SYS_TTY_CONFIG',
    description:
      '使用 vhangup(2)；在虚拟终端上执行各种特权的 ioctl(2) 操作。',
  },
  {
    key: 'AUDIT_CONTROL',
    description:
      '启用和禁用内核审计；更改审计过滤规则；检索审计状态和过滤规则。',
  },
  {
    key: 'MAC_ADMIN',
    description:
      '允许进行 MAC 配置或状态更改。为 Smack LSM 实现。',
  },
  {
    key: 'MAC_OVERRIDE',
    description:
      '覆盖强制访问控制（MAC）。为 Smack Linux 安全模块（LSM）实现。',
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
    description:
      '绕过文件读取权限检查和目录读取及执行权限检查。',
  },
  {
    key: 'LINUX_IMMUTABLE',
    description: '设置 FS_APPEND_FL 和 FS_IMMUTABLE_FL inode 标志。',
  },
  {
    key: 'NET_BROADCAST',
    description: '进行套接字广播，并监听多播。',
  },
  {
    key: 'IPC_LOCK',
    description: '锁定内存（mlock(2)，mlockall(2)，mmap(2)，shmctl(2)）。',
  },
  {
    key: 'IPC_OWNER',
    description:
      '绕过对 System V IPC 对象操作的权限检查。',
  },
  {
    key: 'SYS_PTRACE',
    description: '使用 ptrace(2) 跟踪任意进程。',
  },
  {
    key: 'SYS_BOOT',
    description:
      '使用 reboot(2) 和 kexec_load(2)，重启并加载一个新的内核供以后执行。',
  },
  {
    key: 'LEASE',
    description: '为任意文件建立租约（见 fcntl(2)）。',
  },
  {
    key: 'WAKE_ALARM',
    description: '触发某种能唤醒系统的事件。',
  },
  {
    key: 'BLOCK_SUSPEND',
    description: '使用可以阻止系统挂起的特性。',
  },
];

export const capabilities = capDesc.sort((a, b) => (a.key < b.key ? -1 : 1));
