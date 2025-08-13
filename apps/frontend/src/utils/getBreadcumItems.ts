import { getUserInfo } from '@/services/auth.service';

export const getBreadcrumbItems = (page: string, id?: string) => {
  const userDetails: any = getUserInfo();
  const breadcrumbItems = [];

  // Construct URL based on userDetails?.role, page, and id
  const url = `/${userDetails?.role}/${page}/${id}`;

  // Check if there's an ID in the URL
  if (id) {
    breadcrumbItems.push({
      label: userDetails?.role,
      link: `/${userDetails?.role}`,
    });
    breadcrumbItems.push({
      label: page,
      link: `/${userDetails?.role}/${page}`,
    });
    breadcrumbItems.push({
      label: id,
      link: `/${userDetails?.role}/${page}/${id}`,
    });
  } else {
    // If no ID provided, construct breadcrumbs without ID
    breadcrumbItems.push({
      label: userDetails?.role,
      link: `/${userDetails?.role}`,
    });
    breadcrumbItems.push({
      label: page,
      link: `/${userDetails?.role}/${page}`,
    });
  }

  return breadcrumbItems;
};
