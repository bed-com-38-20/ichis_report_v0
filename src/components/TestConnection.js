import { useDataQuery } from '@dhis2/app-runtime';

const query = {
  me: {
    resource: 'me'
  },
  system: {
    resource: 'system/info'
  }
};

const TestConnection = () => {
  const { loading, error, data } = useDataQuery(query);

  if (loading) return <p>Testing connection...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>Connection Successful</h3>
      <p>Logged in as: {data.me.name}</p>
      <p>DHIS2 Version: {data.system.version}</p>
    </div>
  );
};