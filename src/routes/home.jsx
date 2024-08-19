import React from 'react';
import { Space } from '@mantine/core';
import { Center, Box } from '@mantine/core';

export default function Home() {
    return (
      <>
        <Center>
        <Box>
          <Space h={20} />
          <h1>Home</h1>
          <p>Willkommen in der Mantine-App!</p>
          <Space h={20} />
        </Box>
        </Center>
      </>
    );
}