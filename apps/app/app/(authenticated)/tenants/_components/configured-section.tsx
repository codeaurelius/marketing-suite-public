import ConfiguredSectionPlaceholder from './configured-section-placeholder';

function getVerificationError(verificationResponse: any) {
  try {
    const error = verificationResponse.error;
    if (error.code === 'missing_txt_record') {
      return null;
    }
    return error.message;
  } catch {
    return null;
  }
}

const ConfiguredSection = (domainConfig: any) => {
  const { config } = domainConfig;

  if (!config) {
    return <ConfiguredSectionPlaceholder />;
  }

  if (!config?.verified) {
    const txtVerification = config.verification.find((x) => x?.type === 'TXT');
    return (
      <>
        <div className="flex items-center space-x-3 my-3 px-2 sm:px-10">
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="geometricPrecision"
          >
            <circle cx="12" cy="12" r="10" fill="#EAB308" />
            <path d="M12 8v4" stroke="white" />
            <path d="M12 16h.01" stroke="white" />
          </svg>
          <p className="text-yellow-600 font-medium text-sm">
            Domain is pending verification
          </p>
        </div>

        <div className="w-full border-t border-gray-100 mt-5 mb-8" />

        <div className="px-2 sm:px-10">
          <div className="flex justify-start space-x-4">
            <div className="text-black border-black text-sm border-b-2 pb-1 transition-all ease duration-150">
              Verify Domain Ownership
            </div>
          </div>
          <div className="my-3 text-left">
            <p className="my-5 text-sm">
              Please set the following TXT record on {config.apexName} to prove
              ownership of {config.name}:
            </p>
            <div className="flex justify-start items-start space-x-10 bg-gray-50 p-2 rounded-md">
              <div>
                <p className="text-sm font-bold">Type</p>
                <p className="text-sm font-mono mt-2">{txtVerification.type}</p>
              </div>
              <div>
                <p className="text-sm font-bold">Name</p>
                <p className="text-sm font-mono mt-2">
                  {txtVerification.domain.slice(
                    0,
                    txtVerification.domain.length - config.apexName.length - 1
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold">Value</p>
                <p className="text-sm font-mono mt-2">
                  <span className="text-ellipsis">{txtVerification.value}</span>
                </p>
              </div>
            </div>
            {getVerificationError(config.verificationResponse) && (
              <p className="my-5 text-sm text-red-700">
                {getVerificationError(config.verificationResponse)}
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3 my-3 px-2 sm:px-10">
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill={config?.configured ? '#1976d2' : '#d32f2f'}
          />
          {config?.configured ? (
            <>
              <path
                d="M8 11.8571L10.5 14.3572L15.8572 9"
                fill="none"
                stroke="white"
              />
            </>
          ) : (
            <>
              <path d="M15 9l-6 6" stroke="white" />
              <path d="M9 9l6 6" stroke="white" />
            </>
          )}
        </svg>
        <p
          className={`${
            config?.configured
              ? 'text-black font-normal'
              : 'text-red-700 font-medium'
          } text-sm`}
        >
          {config?.configured ? 'Valid' : 'Invalid'} Configuration
        </p>
      </div>

      {!config?.configured && (
        <>
          <div className="w-full border-t border-gray-100 mt-5 mb-8" />

          <div className="px-2 sm:px-10">
            <div className="flex justify-start space-x-4">
              <div className="text-black border-black text-sm border-b-2 pb-1 transition-all ease duration-150">
                A Record (apex domain)
              </div>
            </div>
            <div className="my-3 text-left">
              <p className="my-5 text-sm">
                Set the following record on your DNS provider to continue:
              </p>
              <div className="flex justify-start items-center space-x-10 bg-gray-50 p-2 rounded-md">
                <div>
                  <p className="text-sm font-bold">Type</p>
                  <p className="text-sm font-mono mt-2">A</p>
                </div>
                <div>
                  <p className="text-sm font-bold">Name</p>
                  <p className="text-sm font-mono mt-2">@</p>
                </div>
                <div>
                  <p className="text-sm font-bold">Value</p>
                  <p className="text-sm font-mono mt-2">76.76.21.21</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConfiguredSection;
