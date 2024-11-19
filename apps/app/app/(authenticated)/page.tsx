// import { database } from '@repo/database';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import type { Metadata } from 'next';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  // const pages = await database.page.findMany();
  const pages = [
    {
      id: 1,
      name: 'Page 1',
    },
    {
      id: 2,
      name: 'Page 2',
    },
    {
      id: 3,
      name: 'Page 3',
    },
    {
      id: 4,
      name: 'Page 4',
    },
    {
      id: 5,
      name: 'Page 5',
    },
    {
      id: 6,
      name: 'Page 6',
    },
    {
      id: 7,
      name: 'Page 7',
    },
    {
      id: 8,
      name: 'Page 8',
    },
    {
      id: 9,
      name: 'Page 9',
    },
    {
      id: 10,
      name: 'Page 10',  
    },
  ];

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {pages.map((page) => (
            <div key={page.id} className="aspect-video rounded-xl bg-muted/50">
              {page.name}
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default App;
