import { array, object, string } from 'yup';

export function validationSchema() {
  return array(
    object().shape({
      host: string().required('主机是必需的'),
      container: string().required('容器是必需的'),
      protocol: string().oneOf(['TCP', 'UDP']),
    })
  ).min(1, '至少需要一个端口绑定');
}
