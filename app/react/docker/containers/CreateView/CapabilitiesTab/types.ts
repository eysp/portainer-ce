export interface Capability {
  key: string;
  description: string;
  default?: boolean;
}

const capDesc: Array<Capability> = [
  {
    key: 'SETPCAP',
    description: '修改进程能力 (capabilities)。',
    default: true,
  },
  {
    key: 'MKNOD',
    description: '使用 mknod(2) 创建特殊设备文件。',
    default: true,
  },
  {
    key: 'AUDIT_WRITE',
    description: '向内核审计日志写入记录。',
    default: true,
  },
  {
    key: 'CHOWN',
    description: '随意更改文件的 UID 和 GID (参考 chown(2))。',
    default: true,
  },
  {
    key: 'NET_RAW',
    description: '使用 RAW 和 PACKET 套接字。',
    default: true,
  },
  {
    key: 'DAC_OVERRIDE',
    description: '忽略文件的读取、写入和执行权限检查。',
    default: true,
  },
  {
    key: 'FOWNER',
    description:
      '忽略要求进程的文件系统 UID 与文件 UID 相匹配的操作权限检查。',
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
    description: '忽略发送信号时的权限检查。',
    default: true,
  },
  {
    key: 'SETGID',
    description:
      '随意操作进程 GID 及附加 GID 列表。',
    default: true,
  },
  {
    key: 'SETUID',
    description: '随意操作进程 UID。',
    default: true,
  },
  {
    key: 'NET_BIND_SERVICE',
    description:
      '绑定网络特权端口 (小于 1024 的端口号)。',
    default: true,
  },
  {
    key: 'SYS_CHROOT',
    description: '使用 chroot(2) 改变根目录。',
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
    description: '执行 I/O 端口操作 (iopl(2) 和 ioperm(2))。',
  },
  {
    key: 'SYS_PACCT',
    description: '使用 acct(2) 开启或关闭进程记账。',
  },
  {
    key: 'SYS_ADMIN',
    description: '执行一系列系统管理操作。',
  },
  {
    key: 'SYS_NICE',
    description:
      '提升进程优先级 nice 值 (nice(2), setpriority(2)) 并更改任意进程的 nice 值。',
  },
  {
    key: 'SYS_RESOURCE',
    description: '覆盖资源限制。',
  },
  {
    key: 'SYS_TIME',
    description:
      '设置系统时钟 (settimeofday(2), stime(2), adjtimex(2))；设置实时 (硬件) 时钟。',
  },
  {
    key: 'SYS_TTY_CONFIG',
    description:
      '使用 vhangup(2)；在虚拟终端上使用各种特权 ioctl(2) 操作。',
  },
  {
    key: 'AUDIT_CONTROL',
    description:
      '启用和禁用内核审计；更改审计过滤规则；获取审计状态与过滤规则。',
  },
  {
    key: 'MAC_ADMIN',
    description:
      '允许 MAC 配置或状态更改 (针对 Smack LSM 实现)。',
  },
  {
    key: 'MAC_OVERRIDE',
    description:
      '覆盖强制访问控制 (MAC) (针对 Smack Linux 安全模块实现)。',
  },
  {
    key: 'NET_ADMIN',
    description: '执行各种网络相关操作。',
  },
  {
    key: 'SYSLOG',
    description: '执行特权 syslog(2) 操作。',
  },
  {
    key: 'DAC_READ_SEARCH',
    description:
      '忽略文件读取权限检查以及目录读取和执行权限检查。',
  },
  {
    key: 'LINUX_IMMUTABLE',
    description: '设置 FS_APPEND_FL 和 FS_IMMUTABLE_FL i-node 标志。',
  },
  {
    key: 'NET_BROADCAST',
    description: '进行套接字广播，并监听多播。',
  },
  {
    key: 'IPC_LOCK',
    description: '锁定内存 (mlock(2), mlockall(2), mmap(2), shmctl(2))。',
  },
  {
    key: 'IPC_OWNER',
    description:
      '忽略 System V IPC 对象操作的权限检查。',
  },
  {
    key: 'SYS_PTRACE',
    description: '使用 ptrace(2) 跟踪任意进程。',
  },
  {
    key: 'SYS_BOOT',
    description:
      '使用 reboot(2) 和 kexec_load(2)，重启系统并加载新内核以供后续执行。',
  },
  {
    key: 'LEASE',
    description: '在任意文件上建立租约 (参考 fcntl(2))。',
  },
  {
    key: 'WAKE_ALARM',
    description: '触发唤醒系统的定时器。',
  },
  {
    key: 'BLOCK_SUSPEND',
    description: '使用可阻止系统挂起的功能。',
  },
];

export const capabilities = capDesc.sort((a, b) => (a.key < b.key ? -1 : 1));
