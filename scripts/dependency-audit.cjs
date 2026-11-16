const {spawnSync}=require('node:child_process');
for(const scope of ['all','production']){
 const args=['audit','--json','--package-lock-only','--ignore-scripts'];if(scope==='production')args.push('--omit=dev');
 const result=spawnSync('npm',args,{encoding:'utf8',timeout:90000,maxBuffer:8388608});
 let report;try{report=JSON.parse(result.stdout);}catch{throw Error('Audit did not return JSON: '+result.stderr);}
 if(!report.metadata?.vulnerabilities)throw Error('Audit unavailable: '+JSON.stringify(report.error||report));
 console.log('AUDIT_SUMMARY '+JSON.stringify({scope,counts:report.metadata.vulnerabilities}));
 for(const item of Object.values(report.vulnerabilities||{}))console.log('AUDIT_ENTRY '+JSON.stringify({scope,...item}));
}